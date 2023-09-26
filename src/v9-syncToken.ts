/*
// Create a state manager for the sync token

import { deepcopy } from "./utils";
import { SyncTokenFunctions } from "./v9-interfaces";

// Define the initial state
const initialToken = "*";

// Create a state manager for the sync token
export const createSyncTokenManager = (initToken: string): SyncTokenFunctions => {
	let syncToken = deepcopy(initToken);
	return {
		getSyncToken: (): string => {
			const retrievedSyncToken = deepcopy(syncToken);
			console.log("The sync token has been retrieved")
			return retrievedSyncToken
		},
		setSyncToken: (newSyncToken: string): string => {
			syncToken = deepcopy(newSyncToken);
			console.log("The sync token has been updated")
			return deepcopy(newSyncToken);
		},
		resetSyncToken: () => {
			syncToken = deepcopy("*");
			console.log("The sync token has been reset");
			return deepcopy(syncToken);
		}
	}
}

const { getSyncToken, setSyncToken, resetSyncToken } = createSyncTokenManager(initialToken);
export { getSyncToken, setSyncToken, resetSyncToken };
*/