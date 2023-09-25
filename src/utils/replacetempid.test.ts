import { State } from '../v9-interfaces';
import replaceTempId from './replacetempid'; // Adjust this to your actual file path

describe('replaceTempId function', () => {

	const emptyState: State = {
		tasks: [],
		projects: [],
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
	};

	it('should replace tempId in items', () => {
		const currentState = { ...emptyState, items: [{ tempId: 'temp1234', id: '' }] };
		// @ts-expect-error
		const result = replaceTempId('temp1234', 'new1234', currentState);

		expect(result).toBeTruthy();
		expect(currentState.items[0].id).toBe('new1234');
	});

	it('should return false when tempId is not found', () => {
		const currentState = { ...emptyState, items: [{ tempId: 'someOtherId', id: '' }] };
		// @ts-expect-error
		const result = replaceTempId('temp1234', 'new1234', currentState);

		expect(result).toBeFalsy();
	});

	it('should only replace the correct tempId', () => {
		const currentState = {
			...emptyState,
			items: [
				{ tempId: 'temp1234', id: '' },
				{ tempId: 'temp5678', id: '' }
			]
		};

		// @ts-expect-error
		replaceTempId('temp1234', 'new1234', currentState);

		expect(currentState.items[0].id).toBe('new1234');
		expect(currentState.items[1].id).toBe('');  // Ensure it wasn't changed
	});

	it('should replace tempId in project_notes', () => {
		const currentState = { ...emptyState, project_notes: [{ tempId: 'temp1234', id: '' }] };

		// @ts-expect-error
		const result = replaceTempId('temp1234', 'new1234', currentState);

		expect(result).toBeTruthy();
		expect(currentState.project_notes[0].id).toBe('new1234');
	});

	// You can add similar tests for other attributes like tasks, projects, etc.
});
