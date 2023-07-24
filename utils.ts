// CHECK AVAILABILITY FUNCTION
// This function is used to check if the commandsArray is available for writing data to it
// For example, if the commandsArray is available, the command will be added to the commandsArray

// checkAvailability is an IIFE that checks the availability of the commandsArray
/*      

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
*/

// CHECK RESPONSE FUNCTION
// This function is used to check the response of the request
// For example, if the response contains the sync_status object, the status of the request will be checked

const checkResponse = (response) => {
	// TODO: Check if the request was successful
	// If the response contains the sync_status object
	if (response.sync_status) {
		// Create an array containing all temporary id's
		const temporaryIds = Object.keys(response.sync_status)

		// Check the success status for each temporary id
		temporaryIds.forEach((temporaryId) => {
			const status = response.sync_status[temporaryId]
			if (status === 'ok') {
				// TODO: Replace the temporary id in the local storage with the real id (?)
				// const realId = response.temp_id_mapping[temporaryId]
				// const item = response.items.find((item) => item.id === id)
				console.info("commit succesful")
				return
			}
			if (status !== 'ok') {
				console.info("commit failed"), console.error(`${status.error_tag} — ${status.error}`)
				return
			}
		})
	}
}

// COPY COMMANDS FROM COMMANDS ARRAY FUNCTION
// This function is used to copy the commands from the commandsArray and clear it from all values
// For example, if the commandsArray contains 3 commands, it will be cleared and the 3 commands will be returned

//+ COPY COMMANDS FUNCTION
const copyCommands = () => {
	// Set the flag "isCommandsArrayAvailable" to false to disable writing data to the commandsArray
	isCommandsArrayAvailable = false;

	// Clone the content of the commandsArray and clear it from all values
	const deepCopiedCommandsArray = deepCopy(commandsArray);
	commandsArray = [];

	// Set the flag "isCommandsArrayAvailable" to true to re-enable writing data to the commandsArray
	isCommandsArrayAvailable = true;

	// Return the cloned commandsArray
	return deepCopiedCommandsArray;
}


// GET RESOURCE TYPE FROM TYPE FUNCTION
// This function is used to get the resource type from the type of the resource
// For example, if the type is 'project', the resource type is 'projects'

//+ GET RESOURCE TYPE FUNCTION
const getResourceType = (type: string) => {
	if (type === 'project' || type === 'section' || type === 'item' || type === 'label' || type === 'note' || type === 'filter' || type === 'reminder' || type === 'collaborator') {
		return `${type}s`
	}
	if (type === 'user' || type === 'user_settings' || type === 'live_notifications') {
		return type
	}
	else {
		return null
	}
}

//+ UPDATE LOCAL STATE FUNCTION
const updateLocalState = (uuid, type, action, args, temp_id?) => {
	// If temp_id is not defined, use the uuid as temp_id
	temp_id === undefined ? uuid : temp_id;

	// Get the resource type
	const resourceType = getResourceType(type)

	const types = ['project', 'section', 'item', 'label', 'note', 'filter', 'reminder']

	// If the resource type is a project, section, item, label, note, filter or reminder
	if (types.includes(type)) {

		// If the command is an 'add' command, add the item to the local state
		if (action === 'add') {
			const item = { ...args, "id": temp_id }
			localState[resourceType].push(item)
			return
		}

		// If the command is an 'update' command, update the item in the local state
		if (action === 'update') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType][index] = Object.assign(item, command.args)
			return
		}

		// If the command is a 'delete' command, remove the item from the local state
		if (action === 'delete') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType].splice(index, 1)
			return
		}
	}

	if (type === 'project' || type === 'section' || type === 'item') {
		// If the command is a 'move' command, move the item in the local state
		if (action === 'move') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType].splice(index, 1)
			localState[resourceType].splice(command.args['child_order'], 0, item)
			return
		}

		// If the command is a 'reorder' command, reorder the item in the local state
		if (action === 'reorder') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType].splice(index, 1)
			localState[resourceType].splice(command.args['child_order'], 0, item)
			return
		}
	}

	if (type === 'item') {
		// If the command is a 'close' command, close the item in the local state
		if (action === 'close') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType][index] = Object.assign(item, { is_deleted: true })
			return
		}

		// If the command is a 'complete' command, complete the item in the local state
		if (action === 'complete') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType][index] = Object.assign(item, { checked: 1 })
			return
		}

		// If the command is a 'uncomplete' command, uncomplete the item in the local state
		if (action === 'uncomplete') {
			const id = args['id']
			const item = localState[resourceType].find((item) => item.id === id)
			const index = localState[resourceType].indexOf(item)
			localState[resourceType][index] = Object.assign(item, { checked: 0 })
			return
		}
	}

	// If the command is a 'archive' command, archive the item in the local state
	if (action === 'archive') {
		const id = args['id']
		const item = localState[resourceType].find((item) => item.id === id)
		const index = localState[resourceType].indexOf(item)
		localState[resourceType][index] = Object.assign(item, { is_archived: true })
		return
	}

	// If the command is a 'unarchive' command, unarchive the item in the local state
	if (action === 'unarchive') {
		const id = args['id']
		const item = localState[resourceType].find((item) => item.id === id)
		const index = localState[resourceType].indexOf(item)
		localState[resourceType][index] = Object.assign(item, { is_archived: false })
		return
	}
}