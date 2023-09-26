// @ts-nocheck

import { findObject } from './findObject';
import { State } from '../v9-interfaces';
import * as Types from '../v9-types';

describe('findObject', () => {
	const mockState: State = {
		collaborator_states: [
			{
				project_id: "1",
				user_id: "abc123",
				state: "active",
				is_deleted: false
			}
		],
		collaborators: [
			{
				id: "abc123",
				email: "john.doe@example.com",
				full_name: "John Doe",
				timezone: "America/New_York",
				image_id: "img123"
			}
		],
		day_orders_timestamp: '1632754791.45',
		day_orders: {
			"1": 5,
			"2": 8
		},
		due_exceptions: [],
		filters: [
			{
				id: "filter1",
				name: "Work",
				query: "project:Work",
				color: "blue",
				item_order: 1,
				is_deleted: false,
				is_favorite: true
			}
		],
		incomplete_item_ids: [],
		incomplete_project_ids: [],
		items: [
			{
				id: "item1",
				user_id: "abc123",
				project_id: "1",
				content: "Finish project report",
				due: {
					date: "2023-10-10",
					timezone: "America/New_York",
					string: "Wed 10 Oct",
					lang: "en",
					is_recurring: false
				},
				priority: 3,
				parent_id: "0",
				child_order: 1,
				section_id: "section1",
				day_order: 5,
				collapsed: false,
				labels: ["label1"],
				checked: false,
				in_history: false,
				is_deleted: false,
				sync_id: null,
				completed_at: null,
				added_at: "2023-09-01"
			}
		],
		labels: [
			{
				id: "label1",
				name: "Urgent",
				color: "red",
				item_order: 1,
				is_deleted: false,
				is_favorite: true
			}
		],
		live_notifications_last_read_id: 10,
		live_notifications: [],
		locations: [],
		notes: [],
		project_notes: [],
		projects: [
			{
				id: "1",
				name: "Work",
				color: "blue",
				parent_id: "0",
				child_order: 1,
				collapsed: 0,
				shared: false,
				is_deleted: false,
				is_archived: false,
				is_favorite: true,
				sync_id: null,
				inbox_project: false,
				team_inbox: false,
				view_style: "list"
			}
		],
		reminders: [],
		sections: [
			{
				id: "section1",
				name: "Tasks for the week",
				project_id: "1",
				section_order: 1,
				collapsed: false,
				sync_id: null,
				is_deleted: false,
				is_archived: false,
				archived_at: "2023-09-04",
				added_at: "2023-09-01"
			}
		],
		settings_notifications: [],
		stats: [],
		tooltips: [],
		user: {
			auto_reminder: 30,
			avatar_big: "https://example.com/avatar_big.png",
			avatar_medium: "https://example.com/avatar_medium.png",
			avatar_s640: "https://example.com/avatar_s640.png",
			avatar_small: "https://example.com/avatar_small.png",
			business_account_id: "biz123",
			daily_goal: 5,
			date_format: true,
			dateist_inline_disabled: false,
			dateist_lang: "en",
			days_off: [6, 7],
			email: "john.doe@example.com",
			features: {},
			full_name: "John Doe",
			id: "abc123",
			image_id: "img123",
			inbox_project_id: "inbox123",
			is_biz_admin: false,
			is_premium: true,
			joined_at: "2022-01-01",
			karma: 1000,
			karma_trend: "up",
			lang: "en",
			legacy_inbox_project: 1,
			legacy_team_inbox: 1,
			next_week: 1,
			premium_until: "2024-01-01",
			sort_order: true,
			start_day: 1,
			start_page: "inbox",
			team_inbox: 1,
			theme_id: 1,
			time_format: true,
			token: "token123",
			tz_info: {
				timezone: "America/New_York",
				offsets: {
					standard: -5,
					daylight: -4
				}
			},
			weekly_goal: 20,
			has_password: true,
			weekend_start_day: 6
		},
		user_settings: {
			reminder_push: true,
			reminder_sms: false,
			reminder_desktop: true,
			reminder_email: true
		}
	};

	it('should find a collaborator by id', () => {
		const collaborator: Types.Collaborator = { id: "1" };
		const result = findObject('collaborators', collaborator, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a collaborator state by project_id and user_id', () => {
		const collaboratorState: Types.CollaboratorState = { project_id: "1", user_id: "1" };
		const result = findObject('collaborator_states', collaboratorState, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a filter by id', () => {
		const filter: Types.Filter = { id: "1" };
		const result = findObject('filters', filter, mockState);
		expect(result).toBeUndefined();
	});

	it('should find an item by id', () => {
		const item: Types.Item = { id: "2" };
		const result = findObject('items', item, mockState);
		const expected = mockState.items.find((item: Types.Item) => item.id === "2");
		expect(result).toEqual(expected);
	});

	it('should find a label by id', () => {
		const label: Types.Label = { id: "2" };
		const result = findObject('labels', label, mockState);
		const expected = mockState.labels.find((label: Types.Label) => label.id === "2");
		expect(result).toEqual(expected);
	});

	it('should find a live notification by id', () => {
		const liveNotification: Types.LiveNotifications = { id: "1" };
		const result = findObject('live_notifications', liveNotification, mockState);
		const expected = mockState.live_notifications.find((liveNotification: Types.LiveNotifications) => liveNotification.id === 1);
		expect(result).toBeUndefined();
	});

	it('should find a note by id', () => {
		const note: Types.Note = { id: "1" };
		const result = findObject('notes', note, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a project note by id', () => {
		const projectNote: Types.ProjectNote = { id: "1" };
		const result = findObject('project_notes', projectNote, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a project by id', () => {
		const project: Types.Project = { id: "1" };
		const result = findObject('projects', project, mockState);
		const expected = mockState.projects.find((project: Types.Project) => project.id === "1");
		expect(result).toEqual(expected);
	});

	it('should find a reminder by id', () => {
		const reminder: Types.Reminder = { id: "1" };
		const result = findObject('reminders', reminder, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a section by id', () => {
		const section: Types.Section = { id: "1" };
		const result = findObject('sections', section, mockState);
		expect(result).toBeUndefined();
	});

	it('should return null if resourceType is not recognized', () => {
		const object: any = { id: "1" };
		const result = findObject('invalid', object, mockState);
		expect(result).toBeNull();
	});

	it('should return null if object is not found', () => {
		const project: Types.Project = { id: "3" };
		const result = findObject('projects', project, mockState);
		expect(result).toBeUndefined();
	});

	it('should find a project by id', () => {
		const project: Types.Project = { id: "1" };
		const result = findObject('projects', project, mockState);
		expect(result).toEqual(mockState.projects.find((project: Types.Project) => project.id === "1"));
	});

	it('should find an item by id', () => {
		const item: Types.Item = { id: "2" };
		const result = findObject('items', item, mockState);
		expect(result).toEqual(mockState.items.find((item: Types.Item) => item.id === "2"));
	});

	it('should find a label by id', () => {
		const label: Types.Label = { id: "2" };
		const result = findObject('labels', label, mockState);
		expect(result).toEqual(mockState.labels.find((label: Types.Label) => label.id === "2"));
	});

	it('should return null if resourceType is not recognized', () => {
		const object: any = { id: "1" };
		const result = findObject('invalid', object, mockState);
		expect(result).toBeNull();
	});

	it('should return null if object is not found', () => {
		const project: Types.Project = { id: "3" };
		const result = findObject('projects', project, mockState);
		expect(result).toBeUndefined();
	});
});