// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Check the root directory for a .env file and load the environment variables from it
dotenv.config();

// Get environment variables or use default values
const TODOIST_BASE_URL = process.env.TODOIST_BASE_URL ? process.env.TODOIST_BASE_URL : "https://api.todoist.com/sync/v9"
const TODOIST_RESOURCE_TYPES = process.env.TODOIST_RESOURCE_TYPES ? process.env.TODOIST_RESOURCE_TYPES : "[\"all\"]"
const TODOIST_AUTOCOMMIT = process.env.TODOIST_AUTOCOMMIT ? process.env.TODOIST_AUTOCOMMIT : "false"

// console.log('TODOIST_BASE_URL: ', TODOIST_BASE_URL)
// console.log('TODOIST_RESOURCE_TYPES: ', TODOIST_RESOURCE_TYPES)
// console.log('TODOIST_AUTOCOMMIT: ', TODOIST_AUTOCOMMIT)

// Export environment variables
export { TODOIST_BASE_URL, TODOIST_RESOURCE_TYPES, TODOIST_AUTOCOMMIT }