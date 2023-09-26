import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';

import * as Types from './v9-types';
import { State, TodoistResources, TodoistResponse, TodoistOptions, Command, CommandsArrayFunctions, StateFunctions } from './v9-interfaces'
import { deepcopy, validateToken, getResourceTypePlural, getApiUrl, findObject } from './utils';
import { TODOIST_BASE_URL, TODOIST_RESOURCE_TYPES, TODOIST_AUTOCOMMIT } from './utils/env';
import { COLORS_BY_ID, colorsById, getColor } from './v9-colors';
import { actionFunctions } from './v9-actions';

/**===============================================**
 *   DEFAULT OPTIONS
/*================================================**/

// Define the default options for the Todoist API
export const defaultOptions: TodoistOptions = {
  'endpoint': TODOIST_BASE_URL || getApiUrl("v9"),
  'resourceTypes': JSON.parse(TODOIST_RESOURCE_TYPES) || ['all'],
  'autocommit': JSON.parse(TODOIST_AUTOCOMMIT) || false
}

/**===================================**
 *   CREATE A COMMANDS ARRAY
/*====================================**/

// Use createCommandsArray function to create a commands array
const createCommandsArray = (initialArray: Command[]): CommandsArrayFunctions => {
  // Create an array to store the commands
  let commandsArray: Command[] = deepcopy(initialArray);
  // Return the functions to interact with the commands array
  return {
    // The getCommands function returns a copy of the commands array
    getCommands: () => {
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },

    // The clearCommands function clears the commands array
    clearCommands: () => {
      commandsArray = [];
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },

    // The addCommand function adds a command to the commands array
    addCommand: (command: Command) => {
      commandsArray.push(command);
      const returnedCommandArray: Command[] = deepcopy(commandsArray);
      return returnedCommandArray;
    },
  };
}
const { getCommands, clearCommands, addCommand } = createCommandsArray([]);

/**===================================**
 *   CREATE A TODOIST API INSTANCE
/*====================================**/

// Function to create a Todoist API instance
export const Todoist = (token: string, userOptions = defaultOptions) => {
  // Validate the token
  validateToken(token);

  // Merge the default options with the user options
  const options = Object.assign({}, defaultOptions, userOptions)

  // Create a new client instance
  const client = got.extend({ method: 'POST', responseType: 'json', headers: { Authorization: `Bearer ${token}` } })

  // Assign the endpoint option and the default sync token to variables
  const endpoint = `${options.endpoint}/sync`
  let syncToken = '*';


  const request = async (url: { url: string; query?: URLSearchParams }, data: Record<string, string> = {}) => {
    let realUrl = typeof url === 'object' ? url.url : url
    let options = typeof url === 'object' ? { searchParams: url.query, form: data } : { form: data }
    const res = await client<TodoistResponse>(realUrl, options)
    return res.body
  }

  /**===================================**
     *   	STATE MANAGER
  /*====================================**/

  // Define the initial state
  const initialState: State = {
    collaborator_states: [],
    collaborators: [],
    day_orders: {},
    day_orders_timestamp: "",
    filters: [],
    items: [],
    labels: [],
    live_notifications: [],
    live_notifications_last_read_id: -1,
    locations: [],
    notes: [],
    project_notes: [],
    projects: [],
    reminders: [],
    sections: [],
    user: {
      id: "0",
      auto_reminder: 0,
      avatar_big: "",
      avatar_medium: "",
      avatar_s640: "",
      avatar_small: "",
      business_account_id: "",
      daily_goal: 0,
      date_format: false,
      dateist_inline_disabled: false,
      dateist_lang: null,
      days_off: [],
      email: "",
      features: {},
      full_name: "",
      image_id: "",
      inbox_project_id: "",
      is_biz_admin: false,
      is_premium: false,
      joined_at: "2000-01-01",
      karma: 0,
      karma_trend: "",
      lang: "en",
      next_week: 1,
      premium_until: "2000-01-01",
      sort_order: false,
      start_day: 1,
      start_page: "inbox",
      team_inbox: 0,
      theme_id: 1,
      time_format: false,
      token: "",
      tz_info: {
        timezone: "",
        gmt_difference_hours: 0,
        gmt_difference_minutes: 0,
        is_dst: false,
        gmt_string: "00:00"
      },
      weekly_goal: 0,
      has_password: false,
      weekend_start_day: 1
    },
    user_settings: {
      reminder_push: true,
      reminder_sms: false,
      reminder_desktop: true,
      reminder_email: true
    },
    due_exceptions: [],
    incomplete_item_ids: [],
    incomplete_project_ids: [],
    settings_notifications: [],
    stats: [],
    tooltips: []
  }

  // Create a state manager for the sync token
  /* const createSyncTokenManager = (initToken: string): SyncTokenFunctions => {
    let syncToken = initToken;
    return {
      getSyncToken: (): string => {
        const retrievedSyncToken = deepcopy(syncToken);
        console.log("The sync token has been retrieved")
        return retrievedSyncToken
      },
      setSyncToken: (newSyncToken: string): string => {
        syncToken = deepcopy(newSyncToken);
        console.log("The sync token has been updated")
        return deepcopy(newSyncToken);
      },
      resetSyncToken: () => {
        syncToken = deepcopy("*");
        console.log("The sync token has been reset");
        return deepcopy(syncToken);
      }
    }
  }

  const { getSyncToken, setSyncToken, resetSyncToken } = createSyncTokenManager(initialToken);
  */

  // Create a state manager for the state and the local state
  const createStateManager = (initState: State): StateFunctions => {
    let state = deepcopy(initState);
    let localState = deepcopy(initState);
    return {
      getState: (): State => {
        // console.log("The state has been retrieved")
        return deepcopy(state);
      },
      setState: (newState: State): State => {
        state = deepcopy(newState);
        // console.log("The state has been updated")
        return deepcopy(state)
      },
      resetState: () => {
        syncToken = "*";   //resetSyncToken();
        state = deepcopy(initState);
        // console.log("The state and the sync token have been reset");
        return deepcopy(state)
      },
      getLocalState: (): State => {
        // console.log("The local state has been retrieved")
        return deepcopy(localState);
      },
      setLocalState: (newLocalState: State): State => {
        localState = deepcopy(newLocalState);
        // console.log("The local state has been updated")
        return deepcopy(localState);
      },
      resetLocalState: () => {
        localState = deepcopy(initState);
        // console.log("The local state has been reset");
        return deepcopy(localState);
      }

    }
  }
  const { getState, setState, resetState } = createStateManager(initialState);
  const { getLocalState, setLocalState, resetLocalState } = createStateManager(initialState);

  /**===================================**
      *  	UPDATE STATE FUNCTIONS	 *
  /*====================================**/

  const findObjectInState = (resourceType: string, id: string, user_id?: string): any => {
    // Define the valid resource types
    const VALID_RESOURCE_TYPES = ['collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'projects', 'reminders', 'sections'];

    // Validate the arguments
    if (!(typeof resourceType === 'string' && VALID_RESOURCE_TYPES.includes(resourceType))) { throw new Error(`Invalid resourceType argument: ${resourceType}. FindObjectInState requires a string value of a valid resource type as its first argument as its first argument`) };
    if (!(typeof id === 'string')) { throw new Error('Invalid id argument: FindObjectInState requires a string value as its second argument') };
    if (!(typeof user_id === 'string' || user_id === undefined)) { throw new Error('Invalid user_id argument: FindObjectInState requires a string value as its optional third argument') };

    // Get the current state
    const state: State = getState();

    // Find the object in the state
    // >>> If the resource type is 'collaborator_states', find the object by project id and user id
    if (resourceType === 'collaborator_states') { return state.collaborator_states.find((collaboratorState: Types.CollaboratorState) => collaboratorState.project_id === id && collaboratorState.user_id === user_id) }
    // >>> If the resource type is not 'collaborator_states', find the object by id
    if (resourceType !== 'collaborator_states') { return state[resourceType].find((object: any) => object.id === id) }
  }

  // The updateState method updates the state based on the latest sync response
  const updateState = (response: TodoistResponse) => {
    const nextState = produce((draft: State, response: TodoistResponse): void => {
      // Check if the response contains the sync token and the full sync flag
      if (!response.hasOwnProperty('sync_token') || !response.hasOwnProperty('full_sync')) { throw new Error('Invalid response! The property "sync_token" and/or the property "full_sync" is missing') }

      // Destructure the sync token and the full sync flag from the response
      const { sync_token, full_sync } = response;

      // Assign the sync token to the syncToken variable
      syncToken = sync_token;

      // Full sync
      if (full_sync === true) {
        const allFields = ['day_orders_timestamp', 'live_notifications_last_read_id', 'locations', 'day_orders', 'settings_notifications', 'user', 'user_settings', 'collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'projects', 'reminders', 'sections']
        // allFields.forEach((field: string) => response[field] && (draft[field] = response[field]));
        allFields.forEach((field: string) => { draft[field] = response[field] });
      }

      // Partial sync
      if (full_sync !== true) {
        // Simple field updates
        const simpleFields = ['day_orders_timestamp', 'live_notifications_last_read_id', 'locations'];
        simpleFields.forEach((field: string) => {
          // If the field is not present in the response, skip it.
          if (!(response[field])) { return }
          // Process each object of this specific type in the sync data.
          draft[field] = response[field]
        })

        // Complex field updates
        const complexFields = ['day_orders', 'settings_notifications', 'user', 'user_settings'];
        complexFields.forEach((field: string) => {
          // If the field is not present in the response, skip it.
          if (!(response[field])) { return }
          // Process each object of this specific type in the sync data.
          draft[field] = Object.assign(draft[field], response[field]);
        });

        const otherFields = ['collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'projects', 'reminders', 'sections'];
        otherFields.forEach((field: string) => {
          // If the field is not present in the response, skip it.
          if (!(response[field])) { return }
          // Process each object of this specific type in the sync data.
          for (const remoteObj of response[field]) {
            // Find out whether the object in the response already exists in the local state.
            const localObj = findObject(field, remoteObj, getState());
            // If the object exists in the local state and the object in the response is not deleted, update the local object with the data from the response.
            if (localObj !== null && remoteObj.is_deleted === false || 0) {
              const updatedObject = Object.assign({}, localObj, remoteObj);
              const index = draft[field].indexOf(localObj);
              draft[field].splice(index, 1, updatedObject);
            }
            // If the object exists in the local state and the object in the response is deleted, remove it from the local state as well.
            if (localObj !== null && remoteObj.is_deleted === true || 1) {
              const index = draft[field].indexOf(localObj);
              draft[field].splice(index, 1);
            }
            // If the object does not exist in the local state and the object in the response is not deleted, add it to the local state.
            if (localObj === null && remoteObj.is_deleted === false || 0) {
              const updatedObject = remoteObj;
              draft[field].push(updatedObject);
            }
            // If the object does not exist in the local state and the object in the response is deleted, do nothing.
            if (localObj === null && remoteObj.is_deleted === true || 1) {
              continue;
            }
          }
        })
      }
    })

    // Get the current state
    const currentState = getState();

    // Get the next state by applying the response to the current state
    const updatedState = nextState(currentState, response);

    // Update the state
    setState(updatedState);

    // Update the local state
    setLocalState(updatedState);

    // Return the updated state
    return updatedState;
  }

  // TODO: refactor this entire function to use a single function for all commands
  // The updateLocalState method updates the local state based on the latest executed command
  const updateLocalState = (resourceType: keyof TodoistResources, action: string, command: Command) => {
    // Get the plural form of the resource type
    const resourceTypes = getResourceTypePlural(resourceType);

    // Get the current local state object
    const localState = getLocalState();

    // Get the current local state for the resource type
    const localStateForResourceType = localState[resourceTypes];

    // Check if the action function exists for the specified resource type and action
    if (!actionFunctions[resourceTypes]) { throw new Error(`No action function found for resourceType: ${resourceType}`) }
    if (!actionFunctions[resourceTypes][action]) { throw new Error(`No action function found for action: ${action}`) }

    // Execute the action function
    actionFunctions[resourceTypes][action](localState, command);

    // Create a new local state object
    const newLocalState = Object.assign({}, localState, { [resourceTypes]: localStateForResourceType });

    // Update the local state
    setLocalState(newLocalState);

    // Update the local state
    return newLocalState
  }

  // The executeCommand method adds a new command to the queue and updates the local state accordingly
  const executeCommand = async (resourceType: keyof TodoistResources, action: string, args: {} = {}) => {

    // Generate a unique id for each command (using the same uuid for 'uuid' and 'temp_id')
    const id = uuidv4()

    // Build the command object
    const command: Command = {
      'type': `${resourceType}_${action}`,
      'uuid': id,
      'temp_id': id,
      'args': args,
    }

    // Add the command to the commandsArray
    addCommand(command);

    // Update the local state
    updateLocalState(resourceType, action, command)

    // If the autocommit option is set to true, commit the command immediately
    if (options.autocommit === true) { await commit() }

    // If the autocommit option is set to false, return the command
    if (options.autocommit === false) { return command }

    // Return the modified item
    return command

    // TODO: Return the local state of the modified resource item, so the temporary id can be used to add other commands that depend on the modified item
  }

  // The createCommand method creates a new command function for the specified resource type and action
  const createCommand = <Args extends {}>(type: keyof TodoistResources, action: string) => async (args: Args) => executeCommand(type, action, args)

  // The sync method syncs the current state with the server and updates the state accordingly
  const sync = async (token?: string) => {
    // Build the data object for the HTTP request
    const data = {
      'sync_token': token || syncToken,
      'resource_types': JSON.stringify(["all"]),
    }

    // Make an HTTP request to sync the data with the server
    const response = await request({ 'url': endpoint }, data)

    // Update the state
    const updatedState = updateState(response)

    // Log the updated state to the console
    // console.dir(updatedState, { depth: 8, colors: true });

    // Return the state
    return updatedState;
  }

  // The commit method executes all the commands in the commands array and updates the state accordingly
  const commit = async (token?: string) => {
    // Get the commands array
    const commands: Command[] = getCommands();

    // Reset the commands array
    clearCommands()

    // Build the data object for the HTTP request
    const data = {
      'sync_token': token || syncToken,
      'resource_types': JSON.stringify(["all"]),
      'commands': JSON.stringify(commands),
    }

    // Make an HTTP request to execute all the commands
    const response = await request({ 'url': endpoint }, data)

    // Update the state with the response
    const updatedState = updateState(response)

    // Log the updated state to the console
    // console.dir(updatedState, { depth: 8, colors: true });

    // Return the state
    return updatedState;
  }

  // API

  const projects = {
    getLocalState: () => (getLocalState())["projects"],
    get: () => (getState())["projects"],
    add: createCommand<Types.ProjectAdd>('project', 'add'),
    update: createCommand<Types.ProjectUpdate>('project', 'update'),
    move: createCommand<Types.ProjectMove>('project', 'move'),
    delete: createCommand<Types.ProjectDelete>('project', 'delete'),
    archive: createCommand<Types.ProjectArchive>('project', 'archive'),
    unarchive: createCommand<Types.ProjectUnarchive>('project', 'unarchive'),
    reorder: createCommand<Types.ProjectReorder>('project', 'reorder'),
  }

  const items = {
    getLocalState: () => (getLocalState())["items"],
    get: () => (getState())["items"],
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
    getLocalState: () => (getLocalState())["labels"],
    get: () => (getState()).labels,
    add: createCommand<Types.LabelAdd>('label', 'add'),
    update: createCommand<Types.LabelUpdate>('label', 'update'),
    delete: createCommand<Types.LabelDelete>('label', 'delete'),
    deleteOccurrences: createCommand<Types.LabelDeleteOccurrences>('label', 'deleteOccurrences'),
    rename: createCommand<Types.LabelRename>('label', 'rename'),
    updateOrders: createCommand<Types.LabelUpdateOrders>('label', 'update_orders'),
  }

  const notes = {
    getLocalState: () => (getLocalState())["notes"],
    get: () => (getState()).notes,
    add: createCommand<Types.NoteAdd>('note', 'add'),
    update: createCommand<Types.NoteUpdate>('note', 'update'),
    delete: createCommand<Types.NoteDelete>('note', 'delete'),
  }

  const projectNotes = {
    getLocalState: () => (getLocalState())["project_notes"],
    get: () => (getState()).project_notes,
    add: createCommand<Types.ProjectNoteAdd>('project_note', 'add'),
    update: createCommand<Types.ProjectNoteUpdate>('project_note', 'update'),
    delete: createCommand<Types.ProjectNoteDelete>('project_note', 'delete'),
  }

  const sections = {
    getLocalState: () => (getLocalState())["sections"],
    get: () => (getState()).sections,
    add: createCommand<Types.SectionAdd>('section', 'add'),
    update: createCommand<Types.SectionUpdate>('section', 'update'),
    move: createCommand<Types.SectionMove>('section', 'move'),
    reorder: createCommand<Types.SectionReorder>('section', 'reorder'),
    delete: createCommand<Types.SectionDelete>('section', 'delete'),
    archive: createCommand<Types.SectionArchive>('section', 'archive'),
    unarchive: createCommand<Types.SectionUnarchive>('section', 'unarchive'),
  }

  const filters = {
    getLocalState: () => (getLocalState())["filters"],
    get: () => (getState()).filters,
    add: createCommand<Types.FilterAdd>('filter', 'add'),
    update: createCommand<Types.FilterUpdate>('filter', 'update'),
    delete: createCommand<Types.FilterDelete>('filter', 'delete'),
    updateOrders: createCommand<Types.FilterUpdateOrders>('filter', 'update_orders'),
  }

  const reminders = {
    getLocalState: () => (getLocalState())["reminders"],
    get: () => (getState()).reminders,
    add: createCommand<Types.ReminderAdd>('reminder', 'add'),
    update: createCommand<Types.ReminderUpdate>('reminder', 'update'),
    delete: createCommand<Types.ReminderDelete>('reminder', 'delete'),
    clearLocations: createCommand<Types.ReminderClearLocations>('reminder', 'clear_locations'),
  }

  const user = {
    getLocalState: () => (getLocalState())["user"],
    get: () => (getState()).user,
    update: createCommand<Types.UserUpdate>('user', 'update'),
    updateGoals: createCommand<Types.UserUpdateGoals>('user', 'update_goals'),
  }

  const settings = {
    getLocalState: () => (getLocalState())["user_settings"],
    get: () => (getState()).user_settings,
    update: createCommand<Types.UserSettingsUpdate>('user_settings', 'update'),
  }

  const sharing = {
    collaborators: () => (getLocalState()).collaborators,
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

  /*
  const collaboratorStates = {
    getLocalState: () => (getLocalState())["collaborator_states"],
    get: () => (getState()).collaborator_states,
  }
  */

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
    get: () => {
      return syncToken
    },
    set: (newToken: string) => {
      const syncToken = newToken;
      return syncToken
    },
  }

  const api = {
    activityLog,
    backup,
    business,
    colorsById: COLORS_BY_ID,
    commit,
    email,
    findObjectState: findObjectInState,
    filters,
    items,
    labels,
    localState: () => getLocalState(),
    liveNotifications,
    notes,
    projects,
    projectNotes,
    reminders,
    sections,
    settings,
    sharing,
    state: getState,
    sync,
    user,
    syncToken: syncToken_,
  }

  return api
}

export default Todoist
export { getColor, colorsById, COLORS_BY_ID }