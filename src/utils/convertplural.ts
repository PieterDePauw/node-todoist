// Mapping object moved outside the function
type singularResourceType = 'collaborator' | 'filter' | 'item' | 'label' | 'live_notifications' | 'note' | 'project' | 'project_note' | 'reminder' | 'section' | 'user' | 'user_settings';
type pluralisedResourceType = 'collaborators' | 'filters' | 'items' | 'labels' | 'live_notifications' | 'notes' | 'projects' | 'project_notes' | 'reminders' | 'sections' | 'user' | 'user_settings';

// Helper function to get plural form and validate
export function getResourceTypePlural(type: singularResourceType): pluralisedResourceType {
	// Define the mapping between TodoistResources keys and localState keys
	const plural: {
		[key in singularResourceType]: pluralisedResourceType;
	} = {
		collaborator: 'collaborators',
		filter: 'filters',
		item: 'items',
		label: 'labels',
		live_notifications: 'live_notifications',
		note: 'notes',
		project: 'projects',
		project_note: 'project_notes',
		reminder: 'reminders',
		section: 'sections',
		user: 'user',
		user_settings: 'user_settings'
	};

	// Get the plural form of the resource type
	const pluralForm = plural[type];

	// Throw an error if the plural form is not found
	if (!pluralForm) { throw new Error(`Plural form not found for resource type: ${type}`); }

	// Return the plural form
	return pluralForm;
}

export default getResourceTypePlural;