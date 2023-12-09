/*

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
  


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


/* // The updateState method updates the state based on the latest sync response
  const updateState = (patch: TodoistResponse): State => {
	let currentState = getState();

	// STEP 1: SYNC_TOKEN
	if (!(patch.sync_token)) { console.warn('The sync token is missing from the response') };
	syncToken = patch.sync_token;

	// STEP 2: FULL_SYNC OR PARTIAL_SYNC
	// > A. FULL_SYNC
	if (patch.full_sync === true) {
	  setState(patch);
	  setLocalState(patch);
	}

	// > B. PARTIAL_SYNC
	if (patch.full_sync === false) {
	  // Define the key sets
	  const syncRelatedKeySet = new Set(['full_sync', 'sync_status', 'temp_id_mapping', 'sync_token']);
	  const replaceableKeySet = new Set(['day_orders_timestamp', 'live_notifications_last_read_id', 'locations']);
	  const mergeableKeySet = new Set(['day_orders', 'settings_notifications', 'user', 'user_settings']);
	  const complexResourceTypesSet = new Set(['collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'project', 'reminders', 'sections']);

	  // UPDATE THE STATE
	  Object.keys(patch).forEach((key: string) => {
		// If the key is not part of the patch, skip it
		if (!patch.hasOwnProperty(key)) {
		  return
		}

		// If the key is part of the syncRelatedKeySet, skip it
		if (syncRelatedKeySet.has(key)) {
		  return
		}

		// If the key is part of the replaceableKeySet, replace the value of the key in the current state with the value of the key in the patch
		if (replaceableKeySet.has(key)) {
		  currentState[key] = patch[key];
		  return;
		}

		if (mergeableKeySet.has(key)) {
		  Object.assign({}, currentState[key], patch[key]);
		  return;
		}

		if (complexResourceTypesSet.has(key)) {
		  return;
		}
	  })

	  setState(currentState);
	  setLocalState(currentState);
	}
	const updatedState = getState();
	return updatedState;
  };


  */