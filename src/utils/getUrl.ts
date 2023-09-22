// Helper function to get the API URL for Todoist Sync API
export function getApiUrl() {
	const api_endpoint = 'https://api.todoist.com';
	const api_version = 'v9';
	return `${api_endpoint}/sync/${api_version}/`;
}

export default getApiUrl;