/*
 * index.js
 */

import got from 'got'
import { v4 as uuid } from 'uuid'
import * as Types from './v9-types'
import { State, TodoistResources, TodoistResponse, UpdatableProperties, dataTypes, dataTypesToAppend, dataTypesToReplace, dataTypesToUpdate, TodoistOptions } from './v9-interfaces'
import { COLORS_BY_ID, colorsById, getColor } from './v9-colors'
const { stringify } = JSON;

// Add shortcut function to deep copy data
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

// Create a flag to indicate if the commands array is available or being used
let isCommandsArrayBeingUsed = false;

// Create a function to deep copy the commands array and clear the commands array  
function lockResources(action) {
  // While isCommandsArrayBeingUsed is true, keep looping but do nothing
  while (isCommandsArrayBeingUsed);

  // Set isCommandsArrayBeingUsed to true
  isCommandsArrayBeingUsed = true;

  // Execute the action function and store the returned value
  const returnValue = action();

  // Set isCommandsArrayBeingUsed to false
  isCommandsArrayBeingUsed = false;

  // Return the returned value
  return returnValue
}

// Create a function to deep copy the commands array and clear the commands array
function deepCopyAndClearCommandsArray() {
  // Create a deep copy of the commands array
  const deepCopiedCommandsArray = JSON.parse(JSON.stringify(commandsArray));
  // Clear the commands array
  commandsArray = [];
  // Return the deep copied commands array
  return deepCopiedCommandsArray
}


/**
 * Create a Todoist API instance
 */
export const Todoist = (token: string, userOptions = defaultOptions) => {
  // Check if the token is valid
  if (!/^[0-9A-Fa-f]{40}$/.test(token)) {
    const errorMessage = `Invalid API token. A token should be 40 characters long and exist of hexadecimals. The token that you have used had ${token.length} characters)`
    throw new Error(errorMessage);
  }

  // options for 'got' library
  const options = Object.assign({}, defaultOptions, userOptions)

  // HTTPS client for Todoist API
  const client = got.extend({
    method: 'POST',
    responseType: 'json',
    headers: { Authorization: `Bearer ${token}` },
  })

  //* ENDPOINT VARIABLE (default value is 'https://api.todoist.com/sync/v9')
  const endpoint = `${options.endpoint}/sync`

  //* SYNC TOKEN VARIABLE (default value is '*')
  let syncToken = '*'

  //* STATE OBJECT
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

  //* LOCAL STATE OBJECT
  let localState: State = deepCopy(state);

  //+ UPDATE STATE FUNCTION
  const updateState = (patch: TodoistResponse) => {
    // STEP 1. Always update the sync token
    syncToken = patch.sync_token

    // STEP 2. Update the state
    /* Case 1: full_sync: replace whole state */
    if (patch.full_sync === true) {
      // Object.assign(state, patch) is not working because it is not deep copying the data
      state = deepCopy(patch);
      return
    }

    /* Case 2: need to replace part of the state that changed */
    if (patch.full_sync === false) {

      const updateItem = <Key extends UpdatableProperties>(key: Key) => {
        // If the key is not present in the patch or if it is not updatable, skip this key
        if (!patch[key] || !dataTypes.includes(key)) {
          return
        }

        // If the key is present in the patch, append, replace or update the state:
        if (patch[key]) {
          // > A. If the key is part of the dataTypesToAppend array, append the data to the state
          if (dataTypesToAppend.includes(key)) {
            state[key] = Object.assign(state[key], patch[key]) as State[Key];
            return
          }

          // > B. If the key is part of the dataTypesToReplace array, replace the data in the state
          if (dataTypesToReplace.includes(key)) {
            state[key] = patch[key] as State[Key]
            return
          }

          // > C. If the key is part of the dataTypesToUpdate array, update the data in the state
          if (dataTypesToUpdate.includes(key)) {
            // 1. Get the current and updated resource items
            const currentResourceItems = state[key]
            const updatedResourceItems = patch[key]

            // 2. Create a set of all updated item id's
            const updatedResourceItemIds = new Set(updatedResourceItems.map((item) => item.id));

            // 3. Do some operations on the current and updated resource items
            const currentResourcesItemsThatAreNotUpdated = currentResourceItems.filter((item) => !updatedResourceItemIds.has(item.id))
            const updatedResourcesItemsThatAreNotDeleted = updatedResourceItems.filter((item) => !item.is_deleted)
            const newResourceItems = currentResourcesItemsThatAreNotUpdated.concat(updatedResourcesItemsThatAreNotDeleted)

            /*
            const newResourceItems = currentResourceItems
            .filter((item) => !updatedResourceItemIds.has(item.id))
            .concat(updatedResourceItems.filter((item) => !item.is_deleted))
            */

            state[key] = newResourceItems as State[Key]
            return
          }
        }
      }

      // Loop over all data types and update the state for each data type
      dataTypes.forEach(updateItem)

      // const dataTypesInPatch = Object.keys(patch)
      // dataTypesInPatch.forEach(updateItem)

    }
  }

  // TODO: Update the local state

  //+ REQUEST FUNCTION
  const request = async (url: { url: string; query?: URLSearchParams }, data: Record<string, string> = {}) => {
    let realUrl = typeof url === 'object' ? url.url : url
    let options = typeof url === 'object' ? { searchParams: url.query, form: data } : { form: data }
    const response = await client<TodoistResponse>(realUrl, options)
    return response.body
  }

  //+ EXECUTE COMMAND FUNCTION
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

    // Push the command to the commandsArray
    const pushCommand = () => commandsArray.push(command);
    await lockResources(pushCommand);
    // commandsArray.push(command);

    // If the autocommit option is set to false, use the command to update the local state
    if (options.autocommit === false) {
      // TODO: Here, we can update the local state instead of the state
    };

    // If the autocommit option is set to true, commit this command immediately
    if (options.autocommit === true) {
      commit()
    };
  }

  //+ CREATE COMMAND FUNCTION
  const createCommand =
    <Args>(type: keyof TodoistResources, action: string) =>
      async (args: Args) =>
        executeCommand(type, action, args)


  //+ SYNC FUNCTION
  const sync = async (resourceTypes = options.resourceTypes) => {
    // Build the data object for the HTTP request
    const data = {
      'sync_token': syncToken,
      'resource_types': stringify(resourceTypes)
    }

    // Make an HTTP request to sync the data with the server
    const response = await request({ 'url': endpoint }, data)

    // Update the state
    updateState(response)

    // Return the state
    return state
  }

  //+ COMMIT FUNCTION
  const commit = async (resourceTypes = options.resourceTypes) => {
    // Make a deep copy of the commands array and reset the commands array
    const commands = lockResources(deepCopyAndClearCommandsArray);

    // Build the data object for the HTTP request
    const data = {
      'sync_token': syncToken,
      'resource_types': stringify(resourceTypes),
      'commands': stringify(commands),
    }

    // Make an HTTP request to execute all the commands
    const response = await request({ 'url': endpoint }, data)

    // TODO: Check if the request was successful
    // If the response contains the sync_status object
    if (response.sync_status) {
      // Create an array containing all temporary id's
      const temporaryIds = Object.keys(response.sync_status)

      // Check the success status for each temporary id
      temporaryIds.forEach((temporaryId) => {
        // Get the sync status for this temporary id
        const status = response.sync_status[temporaryId]

        // If the status is 'ok', replace the temporary id with the real id
        if (status === 'ok') {
          // Get the real id by looking up the temporary id in the response
          const realId = response.temp_id_mapping[temporaryId]
          console.info(`commit succesful:`)
          return
        }

        // If the status is not 'ok', log the error
        if (status !== 'ok') {
          const errorMessage = `${status.error_tag} — ${status.error}`
          console.error(`commit failed:`, errorMessage)
          return
        }
      })
    }
    // If the response does not contain the sync_status object, log an error
    else {
      // Define the error conditions
      const syncStatusError = (response.sync_status === undefined || response.sync_status === null)
      const tempIdError = (response.temp_id_mapping === undefined || response.temp_id_mapping === null)

      // Log the error
      if (syncStatusError && tempIdError) {
        console.error("commit failed: both sync_status and temp_id_mapping are undefined or null")
      }
      if (syncStatusError) {
        console.error("commit failed: sync_status is undefined or null")
      }
      if (tempIdError) {
        console.error("commit failed: temp_id_mapping is undefined or null")
      }
    }

    // Update the state
    updateState(response)

    // Replace local state with latest updates from state
    localState = copyDeep(state);

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
