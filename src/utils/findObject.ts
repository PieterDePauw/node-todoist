import * as Types from "../v9-types";
import { State } from "../v9-interfaces";

// The findObject method finds an object in the state based on the object id
export const findObject = (resourceType: string, object: any, state: State): any => {
	switch (resourceType) {
		case 'collaborators':
			return state.collaborators.find((collaborator: Types.Collaborator) => collaborator.id === object.id);
		case 'collaborator_states':
			return state.collaborator_states.find((collaborator_state: Types.CollaboratorState) => collaborator_state.project_id === object.project_id && collaborator_state.user_id === object.user_id);
		case 'filters':
			return state.filters.find((filter: Types.Filter) => filter.id === object.id);
		case 'items':
			return state.items.find((item: Types.Item) => item.id === object.id);
		case 'labels':
			return state.labels.find((label: Types.Label) => label.id === object.id);
		case 'live_notifications':
			return state.live_notifications.find((live_notification: Types.LiveNotifications) => live_notification.id === object.id);
		case 'notes':
			return state.notes.find((note: Types.Note) => note.id === object.id);
		case 'project_notes':
			return state.project_notes.find((project_note: Types.ProjectNote) => project_note.id === object.id);
		case 'projects':
			return state.projects.find((project: Types.Project) => project.id === object.id);
		case 'reminders':
			return state.reminders.find((reminder: Types.Reminder) => reminder.id === object.id);
		case 'sections':
			return state.sections.find((section: Types.Section) => section.id === object.id);
		default:
			return null;
	}
}

export default findObject;