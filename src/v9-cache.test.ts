import fs from 'fs';
import path from 'path';
import os from 'os';
import { writeCache, readCache } from './v9-cache';
import { TODOIST_CACHE_DIRECTORY_NAME, TODOIST_STATE_FILE_NAME, TODOIST_SYNC_FILE_NAME } from './utils/env';
import { State } from './v9-interfaces';
import { deepcopy } from './utils';

const cacheFilePath = path.join(os.homedir(), TODOIST_CACHE_DIRECTORY_NAME);
const stateCacheFileName = TODOIST_STATE_FILE_NAME;
const syncTokenCacheFileName = TODOIST_SYNC_FILE_NAME;

jest.mock('fs');

// Define the mocked versions of the functions
const mockedFsExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockedFsWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
const mockedFsReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;

// Define a mocked state
let emptyState: State = {
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

describe('Unit Tests', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('writeCache', () => {
		it('should create directory and files if they do not exist', () => {
			mockedFsExistsSync.mockReturnValue(false);
			mockedFsWriteFileSync.mockReturnValue(undefined);

			const mockState = JSON.parse(JSON.stringify(emptyState));
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(fs.mkdirSync).toHaveBeenCalledWith(cacheFilePath);
			expect(mockedFsWriteFileSync).toHaveBeenCalledTimes(4);
		});

		it('should handle errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsWriteFileSync.mockImplementation(() => {
				throw new Error('Filesystem error');
			});

			console.error = jest.fn();

			const mockState = JSON.parse(JSON.stringify(emptyState))
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		});

		it('should not create directory or files if they already exist', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsWriteFileSync.mockReturnValue(undefined);

			const mockState = JSON.parse(JSON.stringify(emptyState));
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(fs.mkdirSync).not.toHaveBeenCalled();
			expect(mockedFsWriteFileSync).toHaveBeenCalledTimes(2); // Only to write content
		});


		it('should handle JSON stringify errors gracefully', () => {
			const originalStringify = JSON.stringify;
			JSON.stringify = jest.fn().mockImplementation(() => {
				throw new Error('JSON stringify error');
			});

			console.error = jest.fn();

			const mockState = JSON.parse(originalStringify(emptyState));  // Use the original stringify
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));

			JSON.stringify = originalStringify;  // Reset the mock
		});

		it('should handle errors during directory creation gracefully', () => {
			mockedFsExistsSync.mockReturnValue(false); // Directory does not exist
			fs.mkdirSync = jest.fn().mockImplementation(() => {
				throw new Error('Directory creation error');
			});

			console.error = jest.fn();

			const mockState = JSON.parse(JSON.stringify(emptyState));
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		});
	});

	describe('readCache', () => {
		it('should return the state and sync token if cache files exist', () => {
			const mockState = JSON.parse(JSON.stringify(emptyState));
			const mockSyncToken = 'sync-token-value';

			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockReturnValueOnce(JSON.stringify(mockState));
			mockedFsReadFileSync.mockReturnValueOnce(JSON.stringify(mockSyncToken));

			const result = readCache();

			expect(result).toEqual({ state: mockState, sync_token: mockSyncToken });
			expect(mockedFsReadFileSync).toHaveBeenCalledTimes(2);
		});

		it('should return an empty state and a default sync token if cache files do not exist', () => {
			mockedFsExistsSync.mockReturnValue(false);

			const result = readCache();

			expect(result).toEqual({ state: {}, sync_token: '*' });
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should handle errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockImplementation(() => {
				throw new Error('Filesystem error');
			});

			console.error = jest.fn();

			const result = readCache();

			expect(result).toEqual({ state: {}, sync_token: '*' });
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should throw an error if only state cache file exists', () => {
			mockedFsExistsSync.mockReturnValueOnce(true)  // Directory exists
				.mockReturnValueOnce(true)  // State file exists
				.mockReturnValueOnce(false); // Sync token file doesn't exist

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});

		it('should throw an error if only sync token cache file exists', () => {
			mockedFsExistsSync.mockReturnValueOnce(true)  // Directory exists
				.mockReturnValueOnce(false) // State file doesn't exist
				.mockReturnValueOnce(true); // Sync token file exists

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});

		it('should handle JSON parse errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockReturnValue('invalid JSON');

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});
	});
});

describe('Integration Tests', () => {
	afterAll(() => {
		// Cleanup after tests
		if (mockedFsExistsSync(path.join(cacheFilePath, `${stateCacheFileName}.json`))) {
			fs.unlinkSync(path.join(cacheFilePath, `${stateCacheFileName}.json`));
		}
		if (mockedFsExistsSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`))) {
			fs.unlinkSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`));
		}
		if (mockedFsExistsSync(cacheFilePath)) {
			fs.rmdirSync(cacheFilePath);
		}
	});

	it('should handle invalid JSON gracefully in the cache files', () => {
		// Write invalid JSON
		mockedFsWriteFileSync(path.join(cacheFilePath, `${stateCacheFileName}.json`), 'invalid JSON');
		mockedFsWriteFileSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`), 'invalid JSON');

		console.error = jest.fn();

		const result = readCache();

		expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		expect(result).toEqual({ state: {}, sync_token: '*' });
	});
});


/*


describe('Unit Tests', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('writeCache', () => {
		it('should create directory and files if they do not exist', () => {
			mockedFsExistsSync.mockReturnValue(false);
			mockedFsWriteFileSync.mockReturnValue(undefined);

			const mockState = deepcopy(emptyState);
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(fs.mkdirSync).toHaveBeenCalledWith(cacheFilePath);
			expect(mockedFsWriteFileSync).toHaveBeenCalledTimes(4);
		});

		it('should handle errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsWriteFileSync.mockImplementation(() => {
				throw new Error('Filesystem error');
			});

			console.error = jest.fn();

			const mockState = deepcopy(emptyState)
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		});
	});

	describe('readCache', () => {
		afterEach(() => {
			jest.resetAllMocks();
		});

		it('should return the state and sync token if cache files exist', () => {
			const mockState = deepcopy(emptyState);
			const mockSyncToken = 'sync-token-value';

			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockReturnValueOnce(JSON.stringify(mockState));
			mockedFsReadFileSync.mockReturnValueOnce(JSON.stringify(mockSyncToken));

			const result = readCache();

			expect(result).toEqual({ state: mockState, sync_token: mockSyncToken });
			expect(mockedFsReadFileSync).toHaveBeenCalledTimes(2);
		});

		it('should return an empty state and a default sync token if cache files do not exist', () => {
			mockedFsExistsSync.mockReturnValue(false);

			const result = readCache();

			expect(result).toEqual({ state: {}, sync_token: '*' });
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should handle errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockImplementation(() => {
				throw new Error('Filesystem error');
			});

			console.error = jest.fn();

			const result = readCache();

			expect(result).toEqual({ state: {}, sync_token: '*' });
			expect(console.error).toHaveBeenCalledTimes(1);
		});
	});

	describe('readCache', () => {
		it('should throw errors for missing directory or files', () => {
			mockedFsExistsSync.mockReturnValueOnce(false);  // Directory does not exist

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});

		it('should handle JSON parse errors gracefully', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsReadFileSync.mockReturnValue('invalid JSON');

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});
	});
	describe('writeCache', () => {
		it('should not create directory or files if they already exist', () => {
			mockedFsExistsSync.mockReturnValue(true);
			mockedFsWriteFileSync.mockReturnValue(undefined);

			const mockState = deepcopy(emptyState);
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(fs.mkdirSync).not.toHaveBeenCalled();
			expect(mockedFsWriteFileSync).toHaveBeenCalledTimes(2); // Only to write content
		});

		it('should handle JSON stringify errors gracefully', () => {
			JSON.stringify = jest.fn().mockImplementation(() => {
				throw new Error('JSON stringify error');
			});
			console.error = jest.fn();

			const mockState = deepcopy(emptyState);
			const mockSyncToken = 'sync-token-value';

			writeCache(mockState, mockSyncToken);

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		});
	});

	describe('readCache', () => {
		it('should throw an error if only state cache file exists', () => {
			mockedFsExistsSync.mockReturnValueOnce(true)  // Directory exists
				.mockReturnValueOnce(true)  // State file exists
				.mockReturnValueOnce(false); // Sync token file doesn't exist

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});

		it('should throw an error if only sync token cache file exists', () => {
			mockedFsExistsSync.mockReturnValueOnce(true)  // Directory exists
				.mockReturnValueOnce(false) // State file doesn't exist
				.mockReturnValueOnce(true); // Sync token file exists

			console.error = jest.fn();

			const result = readCache();

			expect(console.error).toHaveBeenCalledWith(expect.any(Error));
			expect(result).toEqual({ state: {}, sync_token: '*' });
		});
	});
});

describe('Integration Tests', () => {
	afterAll(() => {
		// Cleanup after tests
		if (mockedFsExistsSync(path.join(cacheFilePath, `${stateCacheFileName}.json`))) {
			fs.unlinkSync(path.join(cacheFilePath, `${stateCacheFileName}.json`));
		}
		if (mockedFsExistsSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`))) {
			fs.unlinkSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`));
		}
		if (mockedFsExistsSync(cacheFilePath)) {
			fs.rmdirSync(cacheFilePath);
		}
	});

	it('should handle invalid JSON gracefully in the cache files', () => {
		// Write invalid JSON
		mockedFsWriteFileSync(path.join(cacheFilePath, `${stateCacheFileName}.json`), 'invalid JSON');
		mockedFsWriteFileSync(path.join(cacheFilePath, `${syncTokenCacheFileName}.sync`), 'invalid JSON');

		console.error = jest.fn();

		const result = readCache();

		expect(console.error).toHaveBeenCalledWith(expect.any(Error));
		expect(result).toEqual({ state: {}, sync_token: '*' });
	});
});

/*


//////////


/*
import fs from 'fs';
import os from 'os';
import path from 'path';
import { readCache, writeCache } from './v9-cache';
import { State } from './v9-interfaces';
import { TODOIST_CACHE_DIRECTORY_NAME, TODOIST_STATE_FILE_NAME, TODOIST_SYNC_FILE_NAME } from './utils/env';

describe('Cache', () => {
	const testState: State = {
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
	const testSyncToken = 'test-sync-token';

	describe('writeCache', () => {
		const cacheFilePath = path.join(os.homedir(), TODOIST_CACHE_DIRECTORY_NAME);
		const stateCacheFilePath = `${cacheFilePath}/${TODOIST_STATE_FILE_NAME}.json`;
		const syncTokenCacheFilePath = `${cacheFilePath}/${TODOIST_SYNC_FILE_NAME}.sync`;

		afterEach(() => {
			// Clean up the cache files after each test
			if (fs.existsSync(stateCacheFilePath)) {
				fs.unlinkSync(stateCacheFilePath);
			}
			if (fs.existsSync(syncTokenCacheFilePath)) {
				fs.unlinkSync(syncTokenCacheFilePath);
			}
			if (fs.existsSync(cacheFilePath)) {
				fs.rmdirSync(cacheFilePath);
			}
		});

		it('creates the cache directory and files if they do not exist', () => {
			expect(fs.existsSync(cacheFilePath)).toBe(false);
			expect(fs.existsSync(stateCacheFilePath)).toBe(false);
			expect(fs.existsSync(syncTokenCacheFilePath)).toBe(false);

			writeCache(testState, testSyncToken);

			expect(fs.existsSync(cacheFilePath)).toBe(true);
			expect(fs.existsSync(stateCacheFilePath)).toBe(true);
			expect(fs.existsSync(syncTokenCacheFilePath)).toBe(true);
		});

		it('writes the state and sync token to their respective cache files', () => {
			writeCache(testState, testSyncToken);

			const stateCacheFileContent = fs.readFileSync(stateCacheFilePath, 'utf8');
			const syncTokenCacheFileContent = fs.readFileSync(syncTokenCacheFilePath, 'utf8');

			expect(JSON.parse(stateCacheFileContent)).toEqual(testState);
			expect(JSON.parse(syncTokenCacheFileContent)).toEqual(testSyncToken);
		});
	});

	describe('readCache', () => {
		const cacheFilePath = path.join(os.homedir(), TODOIST_CACHE_DIRECTORY_NAME);
		const stateCacheFilePath = `${cacheFilePath}/${TODOIST_STATE_FILE_NAME}.json`;
		const syncTokenCacheFilePath = `${cacheFilePath}/${TODOIST_SYNC_FILE_NAME}.sync`;

		afterEach(() => {
			// Clean up the cache files after each test
			if (fs.existsSync(stateCacheFilePath)) {
				fs.unlinkSync(stateCacheFilePath);
			}
			if (fs.existsSync(syncTokenCacheFilePath)) {
				fs.unlinkSync(syncTokenCacheFilePath);
			}
			if (fs.existsSync(cacheFilePath)) {
				fs.rmdirSync(cacheFilePath);
			}
		});

		it('throws an error if the cache directory does not exist', () => {
			expect(() => readCache()).toThrowError('Directory for cache files does not exist');
		});

		it('throws an error if the state cache file does not exist', () => {
			fs.mkdirSync(cacheFilePath);
			fs.writeFileSync(syncTokenCacheFilePath, '');

			expect(() => readCache()).toThrowError('Cache file for the state does not exist');
		});

		it('throws an error if the sync token cache file does not exist', () => {
			fs.mkdirSync(cacheFilePath);
			fs.writeFileSync(stateCacheFilePath, '');

			expect(() => readCache()).toThrowError('Cache file for the sync token does not exist');
		});

		it('reads the state and sync token from their respective cache files', () => {
			fs.mkdirSync(cacheFilePath);
			fs.writeFileSync(stateCacheFilePath, JSON.stringify(testState));
			fs.writeFileSync(syncTokenCacheFilePath, JSON.stringify(testSyncToken));

			const { state, sync_token } = readCache();

			expect(state).toEqual(testState);
			expect(sync_token).toEqual(testSyncToken);
		});

		it('returns an empty state and a sync token set to "*" if there is an error', () => {
			fs.mkdirSync(cacheFilePath);
			fs.writeFileSync(stateCacheFilePath, 'invalid-json');
			fs.writeFileSync(syncTokenCacheFilePath, '');

			const { state, sync_token } = readCache();

			expect(state).toEqual({});
			expect(sync_token).toEqual('*');
		});
	});
});
*/