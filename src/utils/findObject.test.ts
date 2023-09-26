// @ts-nocheck
import { findObject } from './findObject';
import * as Types from '../v9-types';
import { State } from '../v9-interfaces';

describe('findObject', () => {

	// Define a mockState with one entry for each resource type
	const mockState: State = {
		collaborators: [
			{
				id: 'collaborator_1',
				email: 'test1@example.com',
				full_name: 'Test Collaborator 1',
				timezone: 'UTC',
				image_id: 'image_1'
			}
		],
		collaborator_states: [
			{
				project_id: 'project_1',
				user_id: 'user_1',
				state: 'active',
				is_deleted: false
			}
		],
		day_orders_timestamp: '1591810376.59',
		day_orders: {
			'item_1': 1
		},
		due_exceptions: [
			{ id: 'due_exception_1' }
		],
		filters: [
			{
				id: 'filter_1',
				name: 'Important Tasks',
				query: 'p1',
				color: 'red',
				item_order: 1,
				is_deleted: false,
				is_favorite: true
			}
		],
		incomplete_item_ids: [
			{ id: 'item_1' }
		],
		incomplete_project_ids: [
			{ id: 'project_1' }
		],
		items: [
			{
				id: 'item_1',
				user_id: 'user_1',
				project_id: 'project_1',
				content: 'Test Task 1',
				due: {
					date: '2023-09-30',
					timezone: 'UTC',
					string: 'Tomorrow',
					lang: 'en',
					is_recurring: false
				},
				priority: 1,
				parent_id: 'parent_1',
				child_order: 1,
				section_id: 'section_1',
				day_order: 1,
				collapsed: false,
				labels: ['label_1'],
				checked: false,
				in_history: false,
				is_deleted: false,
				sync_id: null,
				completed_at: null,
				added_at: '2023-09-25'
			}
		],
		labels: [
			{
				id: 'label_1',
				name: 'Urgent',
				color: 'red',
				item_order: 1,
				is_deleted: false,
				is_favorite: false
			}
		],
		live_notifications_last_read_id: 1,
		live_notifications: [
			{
				id: 'notification_1',
				created_at: 1591810376,
				from_uid: 'user_1',
				notification_key: 'key_1',
				notification_type: 'type_1',
				seq_no: 1,
				is_unread: true
			}
		],
		locations: [['Location1', 'Location2']],
		notes: [
			{
				id: 'note_1',
				item_id: 'item_1',
				project_id: 'project_1',
				content: 'Test Note 1',
				is_deleted: false,
				posted_uid: "",
				uids_to_notify: ["user_1", "user_2"],
				posted_at: "",
				reactions: {},
				file_attachment: {}
			}
		],
		project_notes: [
			{
				id: 'project_note_1',
				project_id: 'project_1',
				content: 'Test Project Note 1',
				is_deleted: false,
				posted_uid: "",
				uids_to_notify: ["user_1", "user_2"],
				posted_at: "",
				reactions: {},
				file_attachment: {} as Types.FileUpload
			},
		],
		projects: [
			{
				id: 'project_1',
				name: 'Test Project',
				color: 'red',
				parent_id: 'parent_project_1',
				child_order: 1,
				collapsed: 1,
				shared: false,
				is_deleted: false,
				is_archived: false,
				is_favorite: false,
				sync_id: null,
				view_style: 'list'
			}
		],
		reminders: [
			{
				id: 'reminder_1',
				notify_uid: 'user_1',
				item_id: 'item_1',
				type: 'email',
				due: {
					date: '2023-09-30',
					timezone: 'UTC',
					string: 'Tomorrow',
					lang: 'en',
					is_recurring: false
				},
				mm_offset: 10,
				name: 'Test Reminder',
				loc_lat: '0',
				loc_long: '0',
				loc_trigger: 'enter',
				radius: 100,
				is_deleted: false
			}
		],
		sections: [
			{
				id: 'section_1',
				name: 'Test Section',
				project_id: 'project_1',
				section_order: 1,
				collapsed: false,
				sync_id: null,
				is_deleted: false,
				is_archived: false,
				archived_at: '2023-09-25',
				added_at: '2023-09-25'
			}
		],
		settings_notifications: [
			{ id: 'setting_1' }
		],
		stats: [
			{ id: 'stat_1' }
		],
		tooltips: [
			{ id: 'tooltip_1' }
		],
		user: {
			auto_reminder: 10,
			avatar_big: 'avatar_big_url',
			avatar_medium: 'avatar_medium_url',
			avatar_s640: 'avatar_s640_url',
			avatar_small: 'avatar_small_url',
			business_account_id: 'business_1',
			daily_goal: 5,
			date_format: true,
			dateist_inline_disabled: false,
			dateist_lang: 'en',
			days_off: [6, 7],
			email: 'test@example.com',
			features: {},
			full_name: 'Test User',
			id: 'user_1',
			image_id: 'image_1',
			inbox_project_id: 'inbox_1',
			is_biz_admin: false,
			is_premium: true,
			joined_at: '2020-01-01',
			karma: 100,
			karma_trend: 'up',
			lang: 'en',
			next_week: 1,
			premium_until: '2025-01-01',
			sort_order: true,
			start_day: 1,
			start_page: 'inbox',
			team_inbox: 1,
			theme_id: 1,
			time_format: true,
			token: 'token_1',
			tz_info: {},
			weekly_goal: 35,
			has_password: true,
			weekend_start_day: 6
		},
		user_settings: {
			reminder_push: true,
			reminder_sms: true,
			reminder_desktop: true,
			reminder_email: true
		}
	};

	const multiEntryState: State = {
		collaborators: [{ id: '1' }, { id: '2' }],
		collaborator_states: [{ project_id: '1', user_id: '2' }, { project_id: '2', user_id: '3' }],
		filters: [{ id: '2' }, { id: '3' }],
		items: [{ id: '1' }, { id: '2' }],
		labels: [{ id: '1' }, { id: '2' }],
		live_notifications: [{ id: '1' }, { id: '2' }],
		notes: [{ id: '1' }, { id: '2' }],
		project_notes: [{ id: '1' }, { id: '2' }],
		projects: [{ id: '1' }, { id: '2' }],
		reminders: [{ id: '1' }, { id: '2' }],
		sections: [{ id: '1' }, { id: '2' }],
	};

	// For collaborators
	it('should find a collaborator by id', () => {
		const result = findObject('collaborators', { id: 'collaborator_1' }, mockState);
		expect(result).toEqual({
			id: 'collaborator_1',
			email: 'test1@example.com',
			full_name: 'Test Collaborator 1',
			timezone: 'UTC',
			image_id: 'image_1'
		});
	});

	it('should not find a collaborator by non-existent id', () => {
		const result = findObject('collaborators', { id: 'collaborator_100' }, mockState);
		expect(result).toBeUndefined();
	});

	// For collaborator_states
	it('should find a collaborator state by project_id and user_id', () => {
		const result = findObject('collaborator_states', { project_id: 'project_1', user_id: 'user_1' }, mockState);
		expect(result).toEqual({
			project_id: 'project_1',
			user_id: 'user_1',
			state: 'active',
			is_deleted: false
		});
	});

	it('should not find a collaborator state by non-existent project_id and user_id', () => {
		const result = findObject('collaborator_states', { project_id: 'project_100', user_id: 'user_100' }, mockState);
		expect(result).toBeUndefined();
	});

	// For filters
	it('should find a filter by id', () => {
		const result = findObject('filters', { id: 'filter_1' }, mockState);
		expect(result).toEqual({
			id: 'filter_1',
			name: 'Important Tasks',
			query: 'p1',
			color: 'red',
			item_order: 1,
			is_deleted: false,
			is_favorite: true
		});
	});

	it('should not find a filter by non-existent id', () => {
		const result = findObject('filters', { id: 'non_existent_filter' }, mockState);
		expect(result).toBeUndefined();
	});


	// For items
	it('should find an item by id', () => {
		const result = findObject('items', { id: 'item_1' }, mockState);
		expect(result).toEqual({
			id: 'item_1',
			user_id: 'user_1',
			project_id: 'project_1',
			content: 'Test Task 1',
			due: {
				date: '2023-09-30',
				timezone: 'UTC',
				string: 'Tomorrow',
				lang: 'en',
				is_recurring: false
			},
			priority: 1,
			parent_id: 'parent_1',
			child_order: 1,
			section_id: 'section_1',
			day_order: 1,
			collapsed: false,
			labels: ['label_1'],
			checked: false,
			in_history: false,
			is_deleted: false,
			sync_id: null,
			completed_at: null,
			added_at: '2023-09-25'
		});
	});

	it('should not find an item by non-existent id', () => {
		const result = findObject('items', { id: 'non_existent_item' }, mockState);
		expect(result).toBeUndefined();
	});

	// For labels
	it('should find a label by id', () => {
		const result = findObject('labels', { id: 'label_1' }, mockState);
		expect(result).toEqual({
			id: 'label_1',
			name: 'Urgent',
			color: 'red',
			item_order: 1,
			is_deleted: false,
			is_favorite: false
		});
	});

	it('should not find a label by non-existent id', () => {
		const result = findObject('labels', { id: 'non_existent_label' }, mockState);
		expect(result).toBeUndefined();
	});

	// For live_notifications
	it('should find a live notification by id', () => {
		const result = findObject('live_notifications', { id: 'notification_1' }, mockState);
		expect(result).toEqual({
			id: 'notification_1',
			created_at: 1591810376,
			from_uid: 'user_1',
			notification_key: 'key_1',
			notification_type: 'type_1',
			seq_no: 1,
			is_unread: true
		});
	});

	it('should not find a live notification by non-existent id', () => {
		const result = findObject('live_notifications', { id: 'non_existent_notification' }, mockState);
		expect(result).toBeUndefined();
	});

	// For notes
	it('should find a note by id', () => {
		const result = findObject('notes', { id: 'note_1' }, mockState);
		expect(result).toEqual({
			id: 'note_1',
			item_id: 'item_1',
			project_id: 'project_1',
			content: 'Test Note 1',
			is_deleted: false,
			posted_uid: "",
			uids_to_notify: ["user_1", "user_2"],
			posted_at: "",
			reactions: {},
			file_attachment: {}
		});
	});

	it('should not find a note by non-existent id', () => {
		const result = findObject('notes', { id: 'non_existent_note' }, mockState);
		expect(result).toBeUndefined();
	});

	// For project_notes
	it('should find a project note by id', () => {
		const result = findObject('project_notes', { id: 'project_note_1' }, mockState);
		expect(result).toEqual({
			id: 'project_note_1',
			project_id: 'project_1',
			content: 'Test Project Note 1',
			is_deleted: false,
			posted_uid: "",
			uids_to_notify: ["user_1", "user_2"],
			posted_at: "",
			reactions: {},
			file_attachment: {} as Types.FileUpload
		});
	});

	it('should not find a project note by non-existent id', () => {
		const result = findObject('project_notes', { id: 'non_existent_project_note' }, mockState);
		expect(result).toBeUndefined();
	});

	// For projects
	it('should find a project by id', () => {
		const result = findObject('projects', { id: 'project_1' }, mockState);
		expect(result).toEqual({
			id: 'project_1',
			name: 'Test Project',
			color: 'red',
			parent_id: 'parent_project_1',
			child_order: 1,
			collapsed: 1,
			shared: false,
			is_deleted: false,
			is_archived: false,
			is_favorite: false,
			sync_id: null,
			view_style: 'list'
		});
	});

	it('should not find a project by non-existent id', () => {
		const result = findObject('projects', { id: 'non_existent_project' }, mockState);
		expect(result).toBeUndefined();
	});


	// For reminders
	it('should find a reminder by id', () => {
		const result = findObject('reminders', { id: 'reminder_1' }, mockState);
		expect(result).toEqual({
			id: 'reminder_1',
			notify_uid: 'user_1',
			item_id: 'item_1',
			type: 'email',
			due: {
				date: '2023-09-30',
				timezone: 'UTC',
				string: 'Tomorrow',
				lang: 'en',
				is_recurring: false
			},
			mm_offset: 10,
			name: 'Test Reminder',
			loc_lat: '0',
			loc_long: '0',
			loc_trigger: 'enter',
			radius: 100,
			is_deleted: false
		});
	});

	it('should not find a reminder by non-existent id', () => {
		const result = findObject('reminders', { id: 'non_existent_reminder' }, mockState);
		expect(result).toBeUndefined();
	});


	// For sections
	it('should find a section by id', () => {
		const result = findObject('sections', { id: 'section_1' }, mockState);
		expect(result).toEqual({
			id: 'section_1',
			name: 'Test Section',
			project_id: 'project_1',
			section_order: 1,
			collapsed: false,
			sync_id: null,
			is_deleted: false,
			is_archived: false,
			archived_at: '2023-09-25',
			added_at: '2023-09-25'
		});
	});

	it('should not find a section by non-existent id', () => {
		const result = findObject('sections', { id: 'non_existent_section' }, mockState);
		expect(result).toBeUndefined();
	});

	// For unknown resource type
	it('should return null for unknown resource type', () => {
		const result = findObject('unknown', { id: 'collaborator_1' }, mockState);
		expect(result).toBeNull();
	});

	// Test cases with null and undefined values
	it('should return undefined for null object', () => {
		expect(() => findObject('collaborators', null, mockState)).toThrow();
	});

	it('should return undefined for undefined object', () => {
		expect(() => findObject('collaborators', undefined, mockState)).toThrow();
	});

	it('should return undefined for null resourceType', () => {
		expect(findObject(null, { id: '1' }, mockState)).toBeNull(); // Since the switch won't match any case
	});

	it('should return null for undefined resourceType', () => {
		expect(findObject(undefined, { id: '1' }, mockState)).toBeNull(); // Matches the default case
	});

	// Test cases with empty state
	it('should return undefined for empty state', () => {
		const result = findObject('collaborators', { id: '1' }, {
			collaborator_states: [],
			collaborators: [],
			day_orders_timestamp: '',
			day_orders: {},
			due_exceptions: [],
			filters: [],
			incomplete_item_ids: [],
			incomplete_project_ids: [],
			items: [],
			labels: [],
			live_notifications_last_read_id: 0,
			live_notifications: [],
			locations: [],
			notes: [],
			project_notes: [],
			projects: [],
			reminders: [],
			sections: [],
			settings_notifications: [],
			stats: [],
			tooltips: [],
			user: {
				auto_reminder: 0,
				avatar_big: '',
				avatar_medium: '',
				avatar_s640: '',
				avatar_small: '',
				business_account_id: '',
				daily_goal: 0,
				date_format: false,
				dateist_inline_disabled: false,
				dateist_lang: null,
				days_off: [],
				email: '',
				features: {},
				full_name: '',
				id: '',
				image_id: '',
				inbox_project_id: '',
				is_biz_admin: false,
				is_premium: false,
				joined_at: '',
				karma: 0,
				karma_trend: '',
				lang: 'en',
				next_week: 1,
				premium_until: '',
				sort_order: false,
				start_day: 1,
				start_page: '',
				team_inbox: 0,
				theme_id: 1,
				time_format: false,
				token: '',
				tz_info: {},
				weekly_goal: 0,
				has_password: false,
				weekend_start_day: 1
			},
			user_settings: {
				reminder_push: false,
				reminder_sms: false,
				reminder_desktop: false,
				reminder_email: false
			}
		});
		expect(result).toBeUndefined();
	});

	// Test cases with multiple entries in state
	it('should find the correct collaborator by id from multiple entries', () => {
		const result = findObject('collaborators', { id: '2' }, multiEntryState);
		expect(result).toEqual({ id: '2' });
	});

	it('should find the correct collaborator state by project_id and user_id from multiple entries', () => {
		const result = findObject('collaborator_states', { project_id: '2', user_id: '3' }, multiEntryState);
		expect(result).toEqual({ project_id: '2', user_id: '3' });
	});

	// For filters
	it('should find the correct filter by id from multiple entries', () => {
		const result = findObject('filters', { id: '3' }, multiEntryState);
		expect(result).toEqual({ id: '3' });
	});

});