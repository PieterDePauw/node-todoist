// Import NPM packages
import got from 'got';
import { v4 as uuidv4 } from 'uuid';
import { produce } from 'immer';

// Import types, interfaces and functions
import * as Types from './v9-types';
import { State, TodoistResources, TodoistResponse, TodoistOptions, Command, CommandsArrayFunctions, StateFunctions } from './v9-interfaces'
import { deepcopy, validateToken, getResourceTypePlural, getApiUrl, findObject, findObjectInState } from './utils';
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
const createCommandsArray = (initArray: Command[]): CommandsArrayFunctions => {
  // Create an array to store the commands
  let commandsArray: Command[] = deepcopy(initArray);
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

  // The request method makes an HTTP request to the Todoist API
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

  // Create a state manager for the state and the local state
  const createStateManager = (initState: State): StateFunctions => {
    let state = deepcopy(initState);
    let localState = deepcopy(initState);
    return {
      getState: (): State => {
        return (deepcopy(state));
      },
      getLocalState: (): State => {
        return deepcopy(localState);
      },
      setState: (newState: State): State => {
        state = deepcopy(newState);
        return deepcopy(state)
      },
      setLocalState: (newLocalState: State): State => {
        localState = deepcopy(newLocalState);
        return deepcopy(localState);
      },
      resetState: (): State => {
        // Reset the sync token
        syncToken = "*";
        state = deepcopy(initState);
        localState = deepcopy(initState);
        return deepcopy(initState)
      },
    }
  }

  // Initialize a state manager for the state and the local state with the initial state
  const { getState, getLocalState, setState, setLocalState, resetState } = createStateManager(initialState);

  /**===================================**
      *  	UPDATE STATE FUNCTIONS	 *
  /*====================================**/

  //! This function is not used temporarily.
  /* const updateState = (response: TodoistResponse) => {
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
    // nextState(currentState, response);
    
    // Update the state
    setState(nextState(currentState, response));
    
    // Get the updated state
    const updatedState = getState();
    
    // Update the state
    setState(updatedState);
    
    // Update the local state
    setLocalState(updatedState);
    
    // Return the updated state
    return updatedState;
  } */
  /* const updateState = (patch: TodoistResponse): State => {
    // Get the current state
    let currentState = getState();  // Using the getState method you've created

    // SYNC_TOKEN
    syncToken = patch.sync_token;
    if (!(patch.sync_token)) { console.warn('The sync token is missing from the response') };

    // FULL_SYNC
    if (patch.full_sync === true) {
      setState(patch);
      setLocalState(patch);
    }

    // PARTIAL_SYNC
    if (patch.full_sync === false) {
      // Define the key sets
      const syncRelatedKeySet = new Set(['full_sync', 'sync_status', 'temp_id_mapping', 'sync_token']);
      const replaceableKeySet = new Set(['day_orders_timestamp', 'live_notifications_last_read_id', 'locations']);
      const mergeableKeySet = new Set(['day_orders', 'settings_notifications', 'user', 'user_settings']);
      const complexResourceTypesSet = new Set(['collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'project', 'reminders', 'sections']);

      // UPDATE THE STATE
      for (const key in patch) {
        if (!patch.hasOwnProperty(key) || syncRelatedKeySet.has(key)) {
          continue;
        }

        const keyOfState = key as keyof State;

        if (replaceableKeySet.has(key)) {
          (currentState[keyOfState] as any) = patch[keyOfState]; // Type assertion
          continue;
        }

        if (mergeableKeySet.has(key)) {
          Object.assign(currentState[keyOfState], patch[keyOfState]);
          continue;
        }

        if (complexResourceTypesSet.has(key)) {
          const currentResourceMap = new Map(
            (currentState[keyOfState] as Types.NodeType[]).map(item => [item.id, item])
          );

          for (const item of (patch[keyOfState] as Types.NodeType[])) {
            if (item.is_deleted) {
              currentResourceMap.delete(item.id);
            } else {
              const currentResource = currentResourceMap.get(item.id);
              if (currentResource) {
                Object.assign(currentResource, item);
              } else {
                currentResourceMap.set(item.id, item);
              }
            }
          }

          (currentState[keyOfState] as any) = Array.from(currentResourceMap.values()); // Type assertion
        }
      }
      setState(currentState);
      setLocalState(currentState);
    }
    const updatedState = getState();
    return updatedState;
  }; */

  // The updateState method updates the state based on the latest sync response
  const updateState = (patch: TodoistResponse): State => {
    const newState: State = { ...getState() };
    return newState;
  }

  // The updateLocalState method updates the local state based on the latest executed command
  const updateLocalState = (resourceType: keyof TodoistResources, action: string, command: Command) => {
    // Get the plural form of the resource type
    const resourceTypes = getResourceTypePlural(resourceType);

    // Get the current local state object
    const localState = getLocalState();

    // Deep copy the local state object
    const deepcopiedLocalState = deepcopy(localState);

    // Check if the action function exists for the specified resource type and action
    if (!actionFunctions) { throw new Error('No action functions found') }
    if (!actionFunctions[resourceTypes]) { throw new Error(`No action function found for resourceType: ${resourceType}`) }
    if (!actionFunctions[resourceTypes][action]) { throw new Error(`No action function found for action: ${action}`) }

    // Execute the action function
    actionFunctions[resourceTypes][action](deepcopiedLocalState, command);

    // Get the updated local state for the resource type
    const localStateForResourceTypeUpdated = localState[resourceTypes];

    // Create a new local state object
    const newLocalState = Object.assign({}, deepcopiedLocalState, { [resourceTypes]: localStateForResourceTypeUpdated });

    // Update the local state
    setLocalState(newLocalState);

    // Get the updated local state
    const updatedLocalState = getLocalState();

    // Update the local state
    return updatedLocalState
  }


  // TODO: Unified update function
  const update = (resourceType: keyof TodoistResources, action: string, command: Command) => {
    const updatedState = { ...getState() };
    return updatedState
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
    // if (options.autocommit === false) { return command }

    // Get the updated local state
    const updatedLocalState = getLocalState();

    // Return the modified item
    return updatedLocalState

    // TODO: Return the local state of the modified resource item, so the temporary id can be used to add other commands that depend on the modified item
  }

  // The createCommand method creates a new command function for the specified resource type and action
  const createCommand = <Args extends {}>(type: keyof TodoistResources, action: string) => async (args: Args) => executeCommand(type, action, args)

  // The sync method syncs the current state with the server and updates the state accordingly
  const sync = async (token?: string) => {
    // Get the sync token
    const sync_token = (token === undefined) ? syncToken : token

    // Build the data object for the HTTP request
    const data = {
      'sync_token': JSON.stringify(sync_token),
      'resource_types': JSON.stringify(["all"]),
    }

    // Make an HTTP request to sync the data with the server
    const response = await request({ 'url': endpoint }, data)

    // Update the state
    updateState(response);

    // Get the updated state
    const updatedState = getState();

    // Return the state
    return updatedState;
  }

  // The commit method executes all the commands in the commands array and updates the state accordingly
  const commit = async (token?: string) => {
    // Get the commands array
    const commands: Command[] = getCommands();

    // Reset the commands array
    clearCommands()

    // Get the sync token
    const sync_token = (token === undefined) ? syncToken : token

    // Build the data object for the HTTP request
    const data = {
      'sync_token': JSON.stringify(sync_token),
      'resource_types': JSON.stringify(["all"]),
      'commands': JSON.stringify(commands),
    }

    // Make an HTTP request to execute all the commands
    const response = await request({ 'url': endpoint }, data)

    // Update the state with the response
    updateState(response)

    // Get the updated state
    const updatedState = getState();

    // Return the state
    return updatedState;
  }

  // API
  // #region API

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
    get: () => (getState())["labels"],
    add: createCommand<Types.LabelAdd>('label', 'add'),
    update: createCommand<Types.LabelUpdate>('label', 'update'),
    delete: createCommand<Types.LabelDelete>('label', 'delete'),
    deleteOccurrences: createCommand<Types.LabelDeleteOccurrences>('label', 'deleteOccurrences'),
    rename: createCommand<Types.LabelRename>('label', 'rename'),
    updateOrders: createCommand<Types.LabelUpdateOrders>('label', 'update_orders'),
  }

  const notes = {
    getLocalState: () => (getLocalState())["notes"],
    get: () => (getState())["notes"],
    add: createCommand<Types.NoteAdd>('note', 'add'),
    update: createCommand<Types.NoteUpdate>('note', 'update'),
    delete: createCommand<Types.NoteDelete>('note', 'delete'),
  }

  const projectNotes = {
    getLocalState: () => (getLocalState())["project_notes"],
    get: () => (getState())["project_notes"],
    add: createCommand<Types.ProjectNoteAdd>('project_note', 'add'),
    update: createCommand<Types.ProjectNoteUpdate>('project_note', 'update'),
    delete: createCommand<Types.ProjectNoteDelete>('project_note', 'delete'),
  }

  const sections = {
    getLocalState: () => (getLocalState())["sections"],
    get: () => (getState())["sections"],
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
    get: () => (getState())["filters"],
    add: createCommand<Types.FilterAdd>('filter', 'add'),
    update: createCommand<Types.FilterUpdate>('filter', 'update'),
    delete: createCommand<Types.FilterDelete>('filter', 'delete'),
    updateOrders: createCommand<Types.FilterUpdateOrders>('filter', 'update_orders'),
  }

  const reminders = {
    getLocalState: () => (getLocalState())["reminders"],
    get: () => (getState())["reminders"],
    add: createCommand<Types.ReminderAdd>('reminder', 'add'),
    update: createCommand<Types.ReminderUpdate>('reminder', 'update'),
    delete: createCommand<Types.ReminderDelete>('reminder', 'delete'),
    clearLocations: createCommand<Types.ReminderClearLocations>('reminder', 'clear_locations'),
  }

  const user = {
    getLocalState: () => (getLocalState())["user"],
    get: () => (getState())["user"],
    update: createCommand<Types.UserUpdate>('user', 'update'),
    updateGoals: createCommand<Types.UserUpdateGoals>('user', 'update_goals'),
  }

  const settings = {
    getLocalState: () => (getLocalState())["user_settings"],
    get: () => (getState())["user_settings"],
    update: createCommand<Types.UserSettingsUpdate>('user_settings', 'update'),
  }

  const sharing = {
    collaborators: () => (getState())["collaborators"],
    get: () => (getState())["collaborators"],
    getLocalState: () => (getLocalState())["collaborators"],
    shareProject: createCommand<Types.CollaboratorShareProject>('collaborator', 'share_project'),
    deleteCollaborator: createCommand<Types.CollaboratorDeleteCollaborator>('collaborator', 'delete_collaborator'),
    acceptInvitation: createCommand<Types.CollaboratorAcceptInvitation>('collaborator', 'accept_invitation'),
    rejectInvitation: createCommand<Types.CollaboratorRejectInvitation>('collaborator', 'reject_invitation'),
    deleteInvitation: createCommand<Types.CollaboratorDeleteInvitation>('collaborator', 'delete_invitation'),
  }

  const liveNotifications = {
    getLocalState: () => (getLocalState())["live_notifications"],
    get: () => (getState())["live_notifications"],
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
    get: () => {
      return syncToken
    },
    set: (newToken: string) => {
      const syncToken = newToken;
      return syncToken
    },
  }

  // #endregion API

  const api = {
    activityLog,
    backup,
    business,
    colorsById: COLORS_BY_ID,
    commit: commit,
    email,
    findObjectState: findObjectInState,
    filters,
    items,
    labels,
    localState: getLocalState,
    liveNotifications,
    notes,
    projects,
    projectNotes,
    reminders,
    sections,
    settings,
    sharing,
    state: getState,
    sync: sync,
    user,
    syncToken: syncToken_,
  }

  return api
}

export default Todoist
export { getColor, colorsById, COLORS_BY_ID }