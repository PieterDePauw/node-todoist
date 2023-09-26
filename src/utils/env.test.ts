import { TODOIST_BASE_URL, TODOIST_RESOURCE_TYPES, TODOIST_AUTOCOMMIT, TODOIST_CACHE_DIRECTORY_NAME, TODOIST_STATE_FILE_NAME, TODOIST_SYNC_FILE_NAME } from './env';  // Replace 'yourModule' with the path to your actual module

describe('Environment Variables Configuration', () => {

    afterEach(() => {
        // Cleanup - reset environment variables after each test
        delete process.env.TODOIST_BASE_URL;
        delete process.env.TODOIST_RESOURCE_TYPES;
        delete process.env.TODOIST_AUTOCOMMIT;
        delete process.env.TODOIST_CACHE_DIRECTORY_NAME;
        delete process.env.TODOIST_STATE_FILE_NAME;
        delete process.env.TODOIST_SYNC_FILE_NAME;
    });

    test('should use default values if environment variables are not set', () => {
        expect(TODOIST_BASE_URL).toBe("https://api.todoist.com/sync/v9");
        expect(TODOIST_RESOURCE_TYPES).toBe("[\"all\"]");
        expect(TODOIST_AUTOCOMMIT).toBe("false");
        expect(TODOIST_CACHE_DIRECTORY_NAME).toBe(".todoist-sync");
        expect(TODOIST_STATE_FILE_NAME).toBe("state");
        expect(TODOIST_SYNC_FILE_NAME).toBe("syncToken");
    });

    test('should use environment variables when set', () => {
        const url = "https://example.com";
        const resources = "[\"tasks\"]";
        const autoCommit = "true";
        const cacheDirectoryName = ".example-dir";
        const stateFileName = "exampleState";
        const syncFileName = "exampleToken";

        process.env.TODOIST_BASE_URL = url;
        process.env.TODOIST_RESOURCE_TYPES = resources;
        process.env.TODOIST_AUTOCOMMIT = autoCommit;
        process.env.TODOIST_CACHE_DIRECTORY_NAME = cacheDirectoryName;
        process.env.TODOIST_STATE_FILE_NAME = stateFileName;
        process.env.TODOIST_SYNC_FILE_NAME = syncFileName;

        expect(process.env.TODOIST_BASE_URL).toBe(url);
        expect(process.env.TODOIST_RESOURCE_TYPES).toBe(resources);
        expect(process.env.TODOIST_AUTOCOMMIT).toBe(autoCommit);
        expect(process.env.TODOIST_CACHE_DIRECTORY_NAME).toBe(cacheDirectoryName);
        expect(process.env.TODOIST_STATE_FILE_NAME).toBe(stateFileName);
        expect(process.env.TODOIST_SYNC_FILE_NAME).toBe(syncFileName);
    });

    test('should use default values if environment variables are not valid', () => {
        const url = "https://example.com";
        const autoCommit = "true";
        const stateFileName = "exampleState";

        process.env.TODOIST_BASE_URL = url;
        process.env.TODOIST_RESOURCE_TYPES = TODOIST_RESOURCE_TYPES
        process.env.TODOIST_AUTOCOMMIT = autoCommit;
        process.env.TODOIST_CACHE_DIRECTORY_NAME = TODOIST_CACHE_DIRECTORY_NAME;
        process.env.TODOIST_STATE_FILE_NAME = stateFileName;
        process.env.TODOIST_SYNC_FILE_NAME = TODOIST_SYNC_FILE_NAME;

        expect(process.env.TODOIST_BASE_URL).toBe(url);
        expect(process.env.TODOIST_RESOURCE_TYPES).toBe(TODOIST_RESOURCE_TYPES);
        expect(process.env.TODOIST_AUTOCOMMIT).toBe(autoCommit);
        expect(process.env.TODOIST_CACHE_DIRECTORY_NAME).toBe(TODOIST_CACHE_DIRECTORY_NAME);
        expect(process.env.TODOIST_STATE_FILE_NAME).toBe(stateFileName);
        expect(process.env.TODOIST_SYNC_FILE_NAME).toBe(TODOIST_SYNC_FILE_NAME);
    });
});
