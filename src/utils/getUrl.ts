// Helper function to get the API URL for Todoist Sync API
export function getApiUrl(api_version: string): string {
	const api_endpoint = 'https://api.todoist.com';
	return `${api_endpoint}/sync/${api_version}/`;
}

export default getApiUrl;