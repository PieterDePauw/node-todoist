/*
 * index.js
 */

import got from 'got'
import { v4 as uuid } from 'uuid'
import * as Types from './v9-types'
import { State, TodoistResources, TodoistResponse, UpdatableProperties, ARRAY_KEYS, TodoistOptions } from './v9-interfaces'
import { COLORS_BY_ID, colorsById, getColor } from './v9-colors'
const { stringify } = JSON;
const deepCopy = (data) => JSON.parse(JSON.stringify(data));

// Define the base URL for the Todoist API
const BASE_URL = 'https://api.todoist.com/sync/v9';

// Define the default options for the Todoist API
export const defaultOptions: TodoistOptions = {
  endpoint: BASE_URL,
  resourceTypes: ['all'],
  autocommit: false,
}

// Create a new array to store the commands
let commandsArray: {
  uuid: string;
  temp_id: string;
  type: string;
  args: {},
}[] = [];

let isCommandsArrayAvailable: boolean = true;

/**
 * Create a Todoist API instance
 */
export const Todoist = (token: string, userOptions = defaultOptions) => {
  if (!/^[0-9A-Fa-f]{40}$/.test(token))
    throw new Error(
      `Invalid API token. A token should be 40 characters long and exist of hexadecimals, was ${token} (${token.length} characters)`
    )

  const options = Object.assign({}, defaultOptions, userOptions)
  const client = got.extend({
    method: 'POST',
    responseType: 'json',
    headers: { Authorization: `Bearer ${token}` },
  })

  const endpoint = `${options.endpoint}/sync`

  let syncToken = '*'
  let state: State = {
    collaborator_states: [],
    collaborators: [],
    day_orders_timestamp: '',
    day_orders: [],
    due_exceptions: [],
    filters: [],
    incomplete_item_ids: [],
    incomplete_project_ids: [],
    items: [],
    labels: [],
    live_notifications_last_read_id: 0,
    live_notifications: [],
    locations: [],
    notes: [],
    project_notes: [], // XXX handle this
    projects: [],
    reminders: [],
    sections: [],
    stats: [],
    temp_id_mapping: {},
    tooltips: [],
    user_settings: null,
    user: null,
  }

  // updateState function
  const updateState = (patch: TodoistResponse) => {
    syncToken = patch.sync_token

    /* Case 1: full_sync: replace whole state */
    if (patch.full_sync) {
      Object.assign(state, patch)
      return
    }

    const updateItem = <Key extends UpdatableProperties>(key: Key) => {
      const items = state[key]
      // in case partial sync
      if (!patch[key]) {
        return
      }
      const newItems: Types.NodeType[] = patch[key]
      const newItemIds = newItems.map((item) => item.id)
      const updatedItems = items
        // remove items that are not found in the result set
        .filter((item) => !newItemIds.includes(item.id))
        // add items from the result set
        .concat(newItems.filter((item) => !item.is_deleted))
      state[key] = updatedItems as State[Key]
    }

    /* Case 2: need to replace part of the state that changed */
    ARRAY_KEYS.forEach(updateItem)
  }

  // request function
  const request = async (url: { url: string; query?: URLSearchParams }, data: Record<string, string> = {}) => {
    let realUrl = typeof url === 'object' ? url.url : url
    let options = typeof url === 'object' ? { searchParams: url.query, form: data } : { form: data }
    const res = await client<TodoistResponse>(realUrl, options)
    return res.body
  }

  // executeCommand function
  const executeCommand = async (type: keyof TodoistResources, action: string, args: {} = {}) => {
    // Generate a unique id for each command (using the same uuid for 'uuid' and 'temp_id')
    const id = uuid()

    // Build the command object
    const command: { uuid: string, temp_id: string, type: string, args: {} } = {
      'uuid': id,
      'temp_id': id,
      'type': `${type}_${action}`,
      'args': args,
    }

    // checkAvailability is an IIFE that checks the availability of the commandsArray
    (function checkAvailability() {
      // If the commandsArray is not yet available, wait 100 ms and try again..
      if (isCommandsArrayAvailable === false) {
        setTimeout(checkAvailability, 100);
      } else
      // If the commandsArray is available, add the command to the commandsArray
      if (isCommandsArrayAvailable === true) {
        commandsArray.push(command);
      }
    })();

    // If the autocommit option is set to true, commit this command immediately
    if (options.autocommit === true) { 
      commit()
    };
  }

  // createCommand function
  const createCommand =
    <Args>(type: keyof TodoistResources, action: string) =>
    async (args: Args) =>
      executeCommand(type, action, args)

  // sync function
  const sync = async (resourceTypes = options.resourceTypes) => {
    // Build the data object for the HTTP request
    const data = {
      'sync_token': syncToken,
      'resource_types': stringify(resourceTypes)
    }

    // Make an HTTP request to sync the data with the server
    const res = await request({ 'url': endpoint }, data)

    // Update the state
    updateState(res)

    // Return the state
    return state
  }

  // commit function
  const commit = async (resourceTypes = options.resourceTypes) => {
    // Clone the content of the commandsArray and clear it from all values
    isCommandsArrayAvailable = false;
    const commands = deepCopy(commandsArray);
    commandsArray = [];
    isCommandsArrayAvailable = true;
    
    // Build the data object for the HTTP request
    const data = {
      'sync_token': syncToken,
      'resource_types': stringify(resourceTypes),
      'commands': stringify(commands),
    }

    // Make an HTTP request to execute all the commands
    const res = await request({ 'url': endpoint }, data)
    
    // TODO: Check if the request was successful

    // Update the state
    updateState(res)

    // Return the state
    return state
  }

  // API

  const projects = {
    get: () => state.projects,
    add: createCommand<Types.ProjectAdd>('project', 'add'),
    update: createCommand<Types.ProjectUpdate>('project', 'update'),
    move: createCommand<Types.ProjectMove>('project', 'move'),
    delete: createCommand<Types.ProjectDelete>('project', 'delete'),
    archive: createCommand<Types.ProjectArchive>('project', 'archive'),
    unarchive: createCommand<Types.ProjectUnarchive>('project', 'unarchive'),
    reorder: createCommand<Types.ProjectReorder>('project', 'reorder'),
  }

  const items = {
    get: () => state.items,
    add: createCommand<Types.ItemAdd>('item', 'add'),
    update: createCommand<Types.ItemUpdate>('item', 'update'),
    move: createCommand<Types.ItemMove>('item', 'move'),
    reorder: createCommand<Types.ItemReorder>('item', 'reorder'),
    delete: createCommand<Types.ItemDelete>('item', 'delete'),
    close: createCommand<Types.ItemClose>('item', 'close'),
    complete: createCommand<Types.ItemComplete>('item', 'complete'),
    uncomplete: createCommand<Types.ItemUncomplete>('item', 'uncomplete'),
    archive: createCommand<Types.ItemArchive>('item', 'archive'),
    unarchive: createCommand<Types.ItemUnarchive>('item', 'unarchive'),
    updateDayOrders: createCommand<Types.ItemUpdateDayOrders>('item', 'update_day_orders'),
    updateDateCompleted: createCommand<Types.ItemUpdateDateComplete>('item', 'update_date_complete'),
  }

  const labels = {
    get: () => state.labels,
    add: createCommand<Types.LabelAdd>('label', 'add'),
    update: createCommand<Types.LabelUpdate>('label', 'update'),
    delete: createCommand<Types.LabelDelete>('label', 'delete'),
    deleteOccurrences: createCommand<Types.LabelDeleteOccurrences>('label', 'deleteOccurrences'),
    rename: createCommand<Types.LabelRename>('label', 'rename'),
    updateOrders: createCommand<Types.LabelUpdateOrders>('label', 'update_orders'),
  }

  const notes = {
    get: () => state.notes,
    add: createCommand<Types.NoteAdd>('note', 'add'),
    update: createCommand<Types.NoteUpdate>('note', 'update'),
    delete: createCommand<Types.NoteDelete>('note', 'delete'),
  }

  const projectNotes = {
    get: () => state.project_notes,
    add: createCommand<Types.ProjectNoteAdd>('project_note', 'add'),
    update: createCommand<Types.ProjectNoteUpdate>('project_note', 'update'),
    delete: createCommand<Types.ProjectNoteDelete>('project_note', 'delete'),
  }

  const sections = {
    get: () => state.sections,
    add: createCommand<Types.SectionAdd>('section', 'add'),
    update: createCommand<Types.SectionUpdate>('section', 'update'),
    move: createCommand<Types.SectionMove>('section', 'move'),
    reorder: createCommand<Types.SectionReorder>('section', 'reorder'),
    delete: createCommand<Types.SectionDelete>('section', 'delete'),
    archive: createCommand<Types.SectionArchive>('section', 'archive'),
    unarchive: createCommand<Types.SectionUnarchive>('section', 'unarchive'),
  }

  const filters = {
    get: () => state.filters,
    add: createCommand<Types.FilterAdd>('filter', 'add'),
    update: createCommand<Types.FilterUpdate>('filter', 'update'),
    delete: createCommand<Types.FilterDelete>('filter', 'delete'),
    updateOrders: createCommand<Types.FilterUpdateOrders>('filter', 'update_orders'),
  }

  const reminders = {
    get: () => state.reminders,
    add: createCommand<Types.ReminderAdd>('reminder', 'add'),
    update: createCommand<Types.ReminderUpdate>('reminder', 'update'),
    delete: createCommand<Types.ReminderDelete>('reminder', 'delete'),
    clearLocations: createCommand<Types.ReminderClearLocations>('reminder', 'clear_locations'),
  }

  const user = {
    get: () => state.user,
    update: createCommand<Types.UserUpdate>('user', 'update'),
    updateGoals: createCommand<Types.UserUpdateGoals>('user', 'update_goals'),
  }

  const settings = {
    get: () => state.user_settings,
    update: createCommand<Types.UserSettingsUpdate>('user_settings', 'update'),
  }

  const sharing = {
    collaborators: () => state.collaborators,
    shareProject: createCommand<Types.CollaboratorShareProject>('collaborator', 'share_project'),
    deleteCollaborator: createCommand<Types.CollaboratorDeleteCollaborator>('collaborator', 'delete_collaborator'),
    acceptInvitation: createCommand<Types.CollaboratorAcceptInvitation>('collaborator', 'accept_invitation'),
    rejectInvitation: createCommand<Types.CollaboratorRejectInvitation>('collaborator', 'reject_invitation'),
    deleteInvitation: createCommand<Types.CollaboratorDeleteInvitation>('collaborator', 'delete_invitation'),
  }

  const liveNotifications = {
    setLastRead: createCommand<Types.LiveNotificationsSetLastRead>('live_notifications', 'set_last_read'),
    markAsRead: createCommand<Types.LiveNotificationsMarkRead>('live_notifications', 'mark_read'),
    markAllAsRead: createCommand<Types.LiveNotificationsMarkReadAll>('live_notifications', 'mark_read_all'),
    markAsUnread: createCommand<Types.LiveNotificationsMarkUnread>('live_notifications', 'mark_unread'),
  }

  const business = {
    // TODO: implement
  }

  const activityLog = {
    get: (options: any) => request({ url: `${options.endpoint}/activity/get`, query: options }),
  }

  const backup = {
    // TODO: implement
  }

  const email = {
    // TODO: implement
  }

  const syncToken_ = {
    get: () => syncToken,
    set: (newToken: string) => {
      syncToken = newToken
    },
  }

  const api = {
    activityLog,
    backup,
    business,
    colorsById: COLORS_BY_ID,
    commit,
    email,
    filters,
    items,
    labels,
    liveNotifications,
    notes,
    projects,
    projectNotes,
    reminders,
    sections,
    settings,
    sharing,
    state,
    sync,
    user,
    syncToken: syncToken_,
  }

  return api
}

export default Todoist
export { getColor, colorsById }
