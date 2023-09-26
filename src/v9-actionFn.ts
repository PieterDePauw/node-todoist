import * as Types from './v9-types';
import { ActionFunctions } from "./v9-interfaces";

// Define the action functions for each resource type
export const actionFunctions: ActionFunctions = {
	projects: {
		add: (localState, command) => {
			const projectToAddWithID = { ...command.args, id: command.uuid, temp_id: command.uuid };
			const defaultProject: Types.Project = {
				id: "",
				name: "",
				child_order: 0,
				collapsed: 0,
				shared: false,
				is_deleted: false,
				is_archived: false,
				sync_id: null,
				color: "red" as Types.ColorId,
				parent_id: "",
				is_favorite: false,
				view_style: "list",
			};
			const addedProject: Types.Project = { ...defaultProject, ...projectToAddWithID };
			localState["projects"].push(addedProject);
			return localState;
		},
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
		archive: (localState, command) => { return localState; },
		unarchive: (localState, command) => { return localState; },
		move: (localState, command) => { return localState; },
		reorder: (localState, command) => { return localState; },
	},
	items: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
		move: (localState, command) => { return localState; },
		close: (localState, command) => { return localState; },
		complete: (localState, command) => { return localState; },
		uncomplete: (localState, command) => { return localState; },
		archive: (localState, command) => { return localState; },
		unarchive: (localState, command) => { return localState; },
		reorder: (localState, command) => { return localState; },
		updateDayOrders: (localState, command) => { return localState; },
		updateDateCompleted: (localState, command) => { return localState; },
	},
	sections: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
		archive: (localState, command) => { return localState; },
		unarchive: (localState, command) => { return localState; },
		move: (localState, command) => { return localState; },
		reorder: (localState, command) => { return localState; },
	},
	labels: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
		rename: (localState, command) => { return localState; },
		updateOrders: (localState, command) => { return localState; },
	},
	sharing: {
		collaborators: (localState, command) => { return localState; },
		shareProject: (localState, command) => { return localState; },
		deleteCollaborator: (localState, command) => { return localState; },
		acceptInvitation: (localState, command) => { return localState; },
		rejectInvitation: (localState, command) => { return localState; },
		deleteInvitation: (localState, command) => { return localState; },
	},
	filters: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
		updateOrders: (localState, command) => { return localState; },
		reorder: (localState, command) => { return localState; },
	},

	live_notifications: {
		// TODO: Implement live_notifications action functions
	},
	notes: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
	},
	project_notes: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
	},
	reminders: {
		add: (localState, command) => { return localState; },
		update: (localState, command) => { return localState; },
		delete: (localState, command) => { return localState; },
	},
};