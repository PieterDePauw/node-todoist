import * as Types from './v9-types'

export type OverwriteKeys =
	| 'day_orders_timestamp'
	| 'live_notifications_last_read_id'
	| 'locations'

export type UpdateKeys =
	| 'day_orders'
	| 'settings_notifications'
	| 'user'
	| 'user_settings'

export type RespModelsMapping =
	| 'collaborators'
	| 'collaborator_states'
	| 'filters'
	| 'items'
	| 'labels'
	| 'live_notifications'
	| 'notes'
	| 'project_notes'
	| 'projects'
	| 'reminders'
	| 'sections'

// Define the resource type and the command type
export type ResourceType = 'projects' | 'items' | 'sections' | 'labels' | 'collaborators' | 'filters' | 'live_notifications' | 'notes' | 'project_notes' | 'reminders' | 'user' | 'user_settings';
export type CommandTypes = 'add' | 'update' | 'delete' | 'archive' | 'unarchive' | 'move' | 'reorder' | 'close' | 'complete' | 'uncomplete' | 'rename' | 'updateOrders' | 'updateDayOrders' | 'updateDateCompleted';

// Define an interface for the resource types and their associated actions
export interface ActionFunctions {
	[resourceType: string]: { [action: string]: (localState: State, command: Command) => void }
};

export type Commands = {
	project_add: {
		type: 'project_add';
		temp_id: string;
		args: Types.ProjectAdd;
		uuid: string;
	},
	project_update: {
		type: 'project_update';
		uuid: string;
		args: Types.ProjectUpdate;
	},
	project_delete: {
		type: 'project_delete';
		uuid: string;
		args: Types.ProjectDelete;
	},
	project_archive: {
		type: 'project_archive';
		uuid: string;
		args: Types.ProjectArchive;
	},
	project_unarchive: {
		type: 'project_unarchive';
		uuid: string;
		args: Types.ProjectUnarchive;
	},
	project_move: {
		type: 'project_move';
		uuid: string;
		args: Types.ProjectMove;
	},
	project_reorder: {
		type: 'project_reorder';
		uuid: string;
		args: Types.ProjectReorder;
	},
	item_add: {
		type: 'item_add';
		temp_id: string;
		args: Types.ItemAdd;
		uuid: string;
	},
	item_update: {
		type: 'item_update';
		uuid: string;
		temp_id: string;
		args: Types.ItemUpdate;
	},
	item_delete: {
		type: 'item_delete';
		uuid: string;
		args: Types.ItemDelete;
	},
	item_move: {
		type: 'item_move';
		uuid: string;
		args: Types.ItemMove;
	},
	item_close: {
		type: 'item_close';
		uuid: string;
		args: Types.ItemClose;
	},
	item_complete: {
		type: 'item_complete';
		uuid: string;
		args: Types.ItemComplete;
	},
	item_uncomplete: {
		type: 'item_uncomplete';
		uuid: string;
		args: Types.ItemUncomplete;
	},
	item_archive: {
		type: 'item_archive';
		uuid: string;
		args: Types.ItemArchive;
	},
	item_unarchive: {
		type: 'item_unarchive';
		uuid: string;
		args: Types.ItemUnarchive;
	},
	item_reorder: {
		type: 'item_reorder';
		uuid: string;
		args: Types.ItemReorder;
	},
	item_updatedayorders: {
		type: 'item_updatedayorders';
		uuid: string;
		args: Types.ItemUpdateDayOrders;
	},
	item_updatedaycompleted: {
		type: 'item_updatedaycomplete';
		uuid: string;
		args: Types.ItemUpdateDateComplete;
	},
	label_add: {
		type: 'label_add';
		temp_id: string;
		args: Types.LabelAdd;
		uuid: string;
	},
	label_update: {
		type: 'label_update';
		uuid: string;
		args: Types.LabelUpdate;
	},
	label_delete: {
		type: 'label_delete';
		uuid: string;
		args: Types.LabelDelete;
	},
	label_rename: {
		type: 'label_rename';
		uuid: string;
		args: Types.LabelRename;
	},
	label_updateorders: {
		type: 'label_updateorders';
		uuid: string;
		args: Types.LabelUpdateOrders;
	}
	label_deleteoccurrences: {
		type: 'label_deleteoccurrences';
		uuid: string;
		args: Types.LabelDeleteOccurrences;
	},
	note_add: {
		type: 'note_add';
		temp_id: string;
		args: Types.NoteAdd;
		uuid: string;
	}
	note_update: {
		type: 'note_update';
		uuid: string;
		args: Types.NoteUpdate;
	}
	note_delete: {
		type: 'note_delete';
		uuid: string;
		args: Types.NoteDelete;
	},
	project_note_add: {
		type: 'project_note_add';
		temp_id: string;
		args: Types.ProjectNoteAdd;
		uuid: string;
	},
	project_note_update: {
		type: 'project_note_update';
		uuid: string;
		args: Types.ProjectNoteUpdate;
	},
	project_note_delete: {
		type: 'project_note_delete';
		uuid: string;
		args: Types.ProjectNoteDelete;
	}
	section_add: {
		type: 'section_add';
		temp_id: string;
		args: Types.SectionAdd;
		uuid: string;
	}
	section_update: {
		type: 'section_update';
		uuid: string;
		args: Types.SectionUpdate;
	},
	section_delete: {
		type: 'section_delete';
		uuid: string;
		args: Types.SectionDelete;
	},
	section_archive: {
		type: 'section_archive';
		uuid: string;
		args: Types.SectionArchive;
	}
	section_unarchive: {
		type: 'section_unarchive';
		uuid: string;
		args: Types.SectionUnarchive;
	}
	section_move: {
		type: 'section_move';
		uuid: string;
		args: Types.SectionMove;
	}
	section_reorder: {
		type: 'section_reorder';
		uuid: string;
		args: Types.SectionReorder;
	}
	filter_add: {
		type: 'filter_add';
		temp_id: string;
		args: Types.FilterAdd;
		uuid: string;
	},
	filter_update: {
		type: 'filter_update';
		uuid: string;
		args: Types.FilterUpdate;
	},
	filter_delete: {
		type: 'filter_delete';
		uuid: string;
		args: Types.FilterDelete;
	}
	filter_updateorders: {
		type: 'filter_updateorders';
		uuid: string;
		args: Types.FilterUpdateOrders;
	}
	reminder_add: {
		type: 'reminder_add';
		temp_id: string;
		args: Types.ReminderAdd;
		uuid: string;
	}
	reminder_update: {
		type: 'reminder_update';
		uuid: string;
		args: Types.ReminderUpdate;
	}
	reminder_delete: {
		type: 'reminder_delete';
		uuid: string;
		args: Types.ReminderDelete;
	}
	reminder_clearlocations: {
		type: 'reminder_clearlocations';
		uuid: string;
		args: Types.ReminderClearLocations;
	}
	user_update: {
		type: 'user_update';
		uuid: string;
		args: Types.UserUpdate;

	}
	user_updategoals: {
		type: 'user_updategoals';
		uuid: string;
		args: Types.UserUpdateGoals;

	}
	user_settings_update: {
		type: 'user_settings_update';
		uuid: string;
		args: Types.UserSettingsUpdate;

	}

};
export type CommandType = 'project_add' | 'project_update' | 'project_delete' | 'project_archive' | 'project_unarchive' | 'project_move' | 'project_reorder' | 'item_add' | 'item_update' | 'item_delete' | 'item_move' | 'item_close' | 'item_complete' | 'item_uncomplete' | 'item_archive' | 'item_unarchive' | 'item_reorder' | 'item_updatedayorders' | 'item_updatedaycompleted' | 'label_add' | 'label_update' | 'label_delete' | 'label_rename' | 'label_updateorders' | 'label_deleteoccurrences' | 'note_add' | 'note_update' | 'note_delete' | 'project_note_add' | 'project_note_update' | 'project_note_delete' | 'section_add' | 'section_update' | 'section_delete' | 'section_archive' | 'section_unarchive' | 'section_move' | 'section_reorder' | 'filter_add' | 'filter_update' | 'filter_delete' | 'filter_updateorders' | 'reminder_add' | 'reminder_update' | 'reminder_delete' | 'reminder_clearlocations' | 'user_update' | 'user_updategoals' | 'user_settings_update'
export type ArgsType<T extends CommandType> = T extends keyof Commands ? Commands[T] : never;

export interface CommandMap<T extends CommandType> {
	type: T;
	uuid: string;
	temp_id: string;
	args: ArgsType<T>;
}

// Create a command type that defines the structure of a command
export type Command = {
	uuid: string;
	temp_id?: string;
	type: string;
	args: { [key: string]: any }
}

export type CommandsArrayFunctions = {
	getCommands: () => Command[];
	clearCommands: () => Command[];
	addCommand: (command: Command) => Command[];
}


export type StateFunctions = {
	getState: () => State;
	getLocalState: () => State;
	setState: (newState: State) => State;
	setLocalState: (newLocalState: State) => State;
	resetState: () => State;
}

export type SyncTokenFunctions = {
	getSyncToken: () => string;
	setSyncToken: (token: string) => string;
	resetSyncToken: () => string;
}

export interface State {
	[StateKeys: string]: any
	collaborator_states: Types.CollaboratorState[]
	collaborators: Types.Collaborator[]
	day_orders_timestamp: string // example: '1591810376.59'
	day_orders: Types.DayOrders
	due_exceptions: Types.NodeType[]
	filters: Types.Filter[]
	incomplete_item_ids: Types.NodeType[]
	incomplete_project_ids: Types.NodeType[]
	items: Types.Item[]
	labels: Types.Label[]
	live_notifications_last_read_id: number
	live_notifications: Types.LiveNotifications[]
	locations: Array<(Array<String>)>
	notes: Types.Note[]
	project_notes: Types.ProjectNote[]
	projects: Types.Project[]
	reminders: Types.Reminder[]
	sections: Types.Section[]
	settings_notifications: Types.NodeType[]
	stats: Types.NodeType[]
	tooltips: Types.NodeType[]
	user: Types.User
	user_settings: Types.UserSettings
}

export type StateKeys =
	| "collaborator_states"
	| "collaborators"
	| "day_orders_timestamp"
	| "day_orders"
	| "due_exceptions"
	| "filters"
	| "incomplete_item_ids"
	| "incomplete_project_ids"
	| "items"
	| "labels"
	| "live_notifications_last_read_id"
	| "live_notifications"
	| "locations"
	| "notes"
	| "project_notes"
	| "projects"
	| "reminders"
	| "sections"
	| "settings_notifications"
	| "stats"
	| "tooltips"
	| "user"
	| "user_settings"

export interface TodoistResources {
	collaborator: Types.Collaborator[]
	filter: Types.Filter[]
	item: Types.Item[]
	label: Types.Label[]
	live_notifications: Types.LiveNotifications[]
	note: Types.Note[]
	project: Types.Project[]
	project_note: Types.ProjectNote[]
	reminder: Types.Reminder[]
	section: Types.Section[]
	user: Types.User
	user_settings: Types.UserSettings
}

export type TodoistResponse = {
	sync_status: Record<string, string & { error_tag: string; error: string }>
	temp_id_mapping: Record<string, string>
	sync_token: string
	full_sync: boolean
} & State

export type ReplaceableProperties =
	| 'day_orders_timestamp'
	| 'live_notifications_last_read_id'
	| 'locations'

export const REPLACEABLE_KEYS: ReplaceableProperties[] = [
	'day_orders_timestamp',
	'live_notifications_last_read_id',
	'locations',
];

export type MergeableProperties =
	| 'day_orders'
	| 'settings_notifications'
	| 'user'
	| 'user_settings'

export const MERGEABLE_KEYS: MergeableProperties[] = [
	'day_orders',
	'settings_notifications',
	'user',
	'user_settings',
];

export const mergeableKeys = [
	'day_orders',
	'settings_notifications',
	'user',
	'user_settings',
];


export type UpdateableProperties =
	| 'collaborator_states'
	| 'collaborators'
	| 'due_exceptions'
	| 'filters'
	| 'items'
	| 'labels'
	| 'live_notifications'
	| 'notes'
	| 'project_notes'
	| 'projects'
	| 'reminders'
	| 'sections'

export const UPDATEABLE_KEYS: UpdateableProperties[] = [
	'collaborator_states',
	'collaborators',
	'due_exceptions',
	'filters',
	'items',
	'labels',
	'live_notifications',
	'notes',
	'project_notes',
	'projects',
	'reminders',
	'sections',
];

export const updateableKeys = [
	'collaborator_states',
	'collaborators',
	'due_exceptions',
	'filters',
	'items',
	'labels',
	'live_notifications',
	'notes',
	'project_notes',
	'projects',
	'reminders',
	'sections',
];

export const ARRAY_KEYS: UpdateableProperties[] = [
	'collaborators',
	'collaborator_states',
	'due_exceptions',
	'filters',
	'items',
	'labels',
	'live_notifications',
	'notes',
	'project_notes',
	'projects',
	'reminders',
	'sections',
]

export type TodoistOptions = {
	'endpoint': string,
	'resourceTypes': Array<string>,
	'autocommit': boolean
}