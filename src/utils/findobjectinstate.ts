import * as Types from "../v9-types";
import { State } from "../v9-interfaces";

export const findObjectInState = (state: State, resourceType: string, id: string, user_id?: string): any => {
	// Define the valid resource types
	const VALID_RESOURCE_TYPES = ['collaborators', 'collaborator_states', 'filters', 'items', 'labels', 'live_notifications', 'notes', 'project_notes', 'projects', 'reminders', 'sections'];

	// Validate the arguments
	if (!(typeof state === 'object')) { throw new Error('Invalid state argument: FindObjectInState requires an object as its first argument') };
	if (!(typeof resourceType === 'string' && VALID_RESOURCE_TYPES.includes(resourceType))) { throw new Error(`Invalid resourceType argument: ${resourceType}. FindObjectInState requires a string value of a valid resource type as its second argument`) };
	if (!(typeof id === 'string')) { throw new Error('Invalid id argument: FindObjectInState requires a string value as its third argument') };
	if (!(typeof user_id === 'string' || user_id === undefined)) { throw new Error('Invalid user_id argument: FindObjectInState requires a string value as its optional fourth argument') };

	// Find the object in the state
	// >>> Define the object to return
	let result: any
	// >>> If the resource type is 'collaborator_states', find the object by project id and user id
	if (resourceType === 'collaborator_states') { result = state.collaborator_states.find((collaboratorState: Types.CollaboratorState) => collaboratorState.project_id === id && collaboratorState.user_id === user_id) }
	// >>> If the resource type is not 'collaborator_states', find the object by id
	if (resourceType !== 'collaborator_states') { result = state[resourceType].find((object: any) => object.id === id) }
	// >>> Return the object
	return result
}

export default findObjectInState;