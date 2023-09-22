import path from 'path';
import os from 'os';
import fs from 'fs';
import { State } from "./v9-interfaces"

// Define the file path and file names for the cache files
const cacheFilePath: string = path.join(os.homedir(), '.todoist-sync');
const stateCacheFileName: string = 'state';
const syncTokenCacheFileName: string = 'syncToken';

export const writeCache = (state: State, sync_token: string) => {
	try {
		// Check if the cache file path exists and create it if it doesn't
		if (!fs.existsSync(cacheFilePath)) { fs.mkdirSync(cacheFilePath) }
		// Check if the cache file for the state exists and create it if it doesn't
		if (!fs.existsSync(`${cacheFilePath}/${stateCacheFileName}.json`)) { fs.writeFileSync(`${cacheFilePath}/${stateCacheFileName}.json`, '') }
		// Check if the cache file for the sync token exists and create it if it doesn't
		if (!fs.existsSync(`${cacheFilePath}/${syncTokenCacheFileName}.sync`)) { fs.writeFileSync(`${cacheFilePath}/${syncTokenCacheFileName}.sync`, '') }

		// Stringify the state and the sync token for writing to a file
		const stateToString: string = JSON.stringify(state, null, 2);
		const syncTokenToString: string = JSON.stringify(sync_token, null, 2);

		// Write the state to a file
		fs.writeFileSync(`${cacheFilePath}/${stateCacheFileName}.json`, stateToString)
		fs.writeFileSync(`${cacheFilePath}/${syncTokenCacheFileName}.sync`, syncTokenToString)
	}
	catch (error) {
		console.error(error);
	}
}

export const readCache = () => {
	try {
		// Check if the cache file path exists
		if (!fs.existsSync(cacheFilePath)) { throw new Error('Directory for cache files does not exist') }
		// Check if the cache file for the sync token exists
		if (!fs.existsSync(`${cacheFilePath}/${stateCacheFileName}.json`)) { throw new Error('Cache file for the state does not exist') }
		// Check if the cache file for the sync token exists
		if (!fs.existsSync(`${cacheFilePath}/${syncTokenCacheFileName}.sync`)) { throw new Error('Cache file for the sync token does not exist') }

		// Read the state from a file
		const state: State = JSON.parse(fs.readFileSync(`${cacheFilePath}/${stateCacheFileName}.json`, 'utf8'));
		const syncToken: string = JSON.parse(fs.readFileSync(`${cacheFilePath}/${syncTokenCacheFileName}.sync`, 'utf8'));

		// Return the state and sync token
		return { state: state, sync_token: syncToken };
	}
	catch (error) {
		console.error(error);
		return { state: {}, sync_token: '*' };
	}
}