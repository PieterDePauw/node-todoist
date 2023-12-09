// Import the necessary modules
import path from 'path';
import { homedir } from 'os';
import { promises as fs } from 'fs';

// Import the necessary interfaces and types
import { State } from "./v9-interfaces";

// Import the necessary constants
import { TODOIST_CACHE_DIRECTORY_NAME, TODOIST_STATE_FILE_NAME, TODOIST_SYNC_FILE_NAME } from './utils/env';

// Define the file path and file names for the cache files
const cacheFilePath: string = path.join(homedir(), TODOIST_CACHE_DIRECTORY_NAME);
const stateCacheFilePath: string = path.join(cacheFilePath, `${TODOIST_STATE_FILE_NAME}.json`);
const syncTokenCacheFilePath: string = path.join(cacheFilePath, `${TODOIST_SYNC_FILE_NAME}.json`);

/** FUNCTION: ensureDirectoryExists
 * Ensures that the directory at the provided path exists, including any necessary parent directories.
 *
 * @param {string} cacheFilePath The path to the cache directory.
 * @param {boolean} createIfNotExist Determines whether to create the directory (and any necessary parent directories) if it doesn't exist.
 * @returns {Promise<void>} A promise that resolves when the directory exists.
 * @throws {Error} If the directory does not exist and `createIfNotExist` is false.
 */
export const ensureDirectoryExists = async (cacheFilePath: string, createIfNotExist: boolean): Promise<void> => {
	try {
		// Check if the cache file path exists (strictly, this could be done by fs.mkdir, but this is more explicit)
		await fs.access(cacheFilePath);
	} catch {
		// If the directory does not exist and `createIfNotExist` is false, throw an error
		if (!createIfNotExist) throw new Error(`Directory for cache files does not exist at path: ${cacheFilePath}`);
		// If the directory does not exist and `createIfNotExist` is true, create the directory (and any necessary parent directories, if defined in the path)
		await fs.mkdir(cacheFilePath, { recursive: true });
	} finally {
		// Log success to the console
		console.log(`Directory for cache files exists at path: ${cacheFilePath}`);
	}
};

/** FUNCTION: ensureFileExists
 * Ensures that the file at the provided path exists
 *
 * @param {string} filePath The path to the file.
 * @param {boolean} createIfNotExist Determines whether to create the file if it doesn't exist.
 * @returns {Promise<void>} A promise that resolves when the file exists.
 * @throws {Error} If the file does not exist and `createIfNotExist` is false.
 */
export const ensureFileExists = async (filePath: string, createIfNotExist: boolean): Promise<void> => {
	try {
		await fs.access(filePath);
	} catch {
		// If the file does not exist and `createIfNotExist` is false, throw an error
		if (!createIfNotExist) throw new Error(`File does not exist at path: ${filePath}`);
		// Otherwise, create the file
		await fs.writeFile(filePath, '', { encoding: 'utf8', mode: 0o644, flag: 'wx' });
	}
}

/** FUNCTION: writeCache
 * Writes the state and sync token to their respective cache files.
 *
 * @param state The state to write to the cache file.
 * @param sync_token The sync token to write to the cache file.
 * @returns {Promise<void>} A promise that resolves when the state and sync token have been written to their respective cache files.
 * @throws {Error} If the directory does not exist and `createIfNotExist` is false.
 */
export const writeCache = async (state: State, sync_token: string): Promise<void> => {
	try {
		// Ensure that the cache directory exists
		await ensureDirectoryExists(cacheFilePath, true);

		// Check if the cache directory exists and create it if it doesn't
		await fs.mkdir(cacheFilePath, { recursive: true });

		// Check if the cache file for the state exists and create it if it doesn't
		await fs.writeFile(stateCacheFilePath, '', { encoding: 'utf8', mode: 0o644, flag: 'wx' });

		// Stringify the state and the sync token for writing to a file
		const stateToString: string = JSON.stringify(state, null, 2);
		const syncTokenToString: string = JSON.stringify(sync_token, null, 2);

		// Write the state and the sync token to their respective files
		await Promise.all([
			fs.writeFile(stateCacheFilePath, stateToString),
			fs.writeFile(syncTokenCacheFilePath, syncTokenToString)
		]);
	}
	catch (error) {
		// Log the error to the console
		console.error(error);
		// Propagate the error
		throw error;
	}
};

/** FUNCTION: readCache
 * Reads the state and sync token from their respective cache files.
 *
 * @returns {Promise<{ state: State, sync_token: string }>} A promise that resolves with the state and sync token from their respective cache files.
 * @throws {Error} If the directory does not exist and `createIfNotExist` is false.
 */
export const readCache = async (): Promise<{ state: State, sync_token: string }> => {
	try {
		// Ensure that the cache directory exists
		await ensureDirectoryExists(cacheFilePath, false);

		// Ensure that the cache file for the state exists
		await ensureFileExists(stateCacheFilePath, false);
		await ensureFileExists(syncTokenCacheFilePath, false);

		// Read the state and the sync token from their respective files, concurrently
		const [stateContent, syncTokenContent] = await Promise.all([
			fs.readFile(stateCacheFilePath, 'utf8'),
			fs.readFile(syncTokenCacheFilePath, 'utf8')
		]);

		// Parse the state and the sync token from their respective files contents
		const state: State = JSON.parse(stateContent);
		const sync_token: string = JSON.parse(syncTokenContent);

		// Return the state and sync token
		return { state: state, sync_token: sync_token };
	}
	catch (error) {
		// Log the error to the console
		console.error(error);
		// Propagate the error
		throw error;
	}
};
