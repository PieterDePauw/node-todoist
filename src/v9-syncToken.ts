// Import utility functions and interfaces from other files
import { SyncTokenFunctions } from "./v9-interfaces";

// Define the default initial token as a constant
const defaultSyncToken = process.env.TODOIST_DEFAULT_INITIAL_SYNC_TOKEN || "*";

// Create a state manager for the sync token
export const createSyncTokenManager = (initialSyncToken: string = defaultSyncToken): SyncTokenFunctions => {
	let syncToken = initialSyncToken;

	return {
		getSyncToken: (): string => syncToken,
		setSyncToken: (newSyncToken: string): string => {
			syncToken = newSyncToken;
			return newSyncToken;
		},
		resetSyncToken: (): string => {
			syncToken = initialSyncToken;
			return syncToken;
		}
	};
};

// Initialize the sync token manager with the initial state
export const syncTokenManager = createSyncTokenManager();

export const { getSyncToken, setSyncToken, resetSyncToken } = syncTokenManager;

// Export the sync token manager
export default syncTokenManager;
