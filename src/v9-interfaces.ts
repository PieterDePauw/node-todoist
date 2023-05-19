import * as Types from './v9-types'

export interface State {
	collaborator_states: Types.NodeType[]
	collaborators: Types.Collaborator[]
	day_orders_timestamp: string // example: '1591810376.59'
	day_orders: Types.NodeType[]
	due_exceptions: Types.NodeType[]
	filters: Types.Filter[]
	incomplete_item_ids: Types.NodeType[]
	incomplete_project_ids: Types.NodeType[]
	items: Types.Item[]
	labels: Types.Label[]
	live_notifications_last_read_id: number
	live_notifications: Types.LiveNotifications[]
	locations: Types.NodeType[]
	notes: Types.Note[]
	project_notes: Types.ProjectNote[]
	projects: Types.Project[]
	reminders: Types.Reminder[]
	sections: Types.Section[]
	stats: Types.NodeType[]
	tooltips: Types.NodeType[]
	user_settings: Types.UserSettings | null
	user: Types.User | null
	temp_id_mapping: Record<string, number>
}

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

export type UpdatableProperties =
	| 'collaborators'
	| 'collaborator_states'
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

export const ARRAY_KEYS: UpdatableProperties[] = [
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
	'autocommit'?: boolean
}
