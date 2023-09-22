import { State } from "../v9-interfaces"

// TODO: implement this function with setState() in the main v9 code
export const replaceTempId = (tempId: string, newId: string, currentState: State): boolean => {
	// const currentState = getState();
	const dataTypes = ['filters', 'items', 'labels', 'notes', 'project_notes', 'projects', 'reminders', 'sections'];
	for (const dataType of dataTypes) {
		for (const object of currentState[dataType]) {
			if (object.tempId === tempId) {
				object.id = newId;
				return true;
			}
		}
	}
	return false;
}

export default replaceTempId;