import getApiUrl from './getUrl';

describe('getApiUrl', () => {
	it('returns the correct URL for a given API version', () => {
		const apiVersion = 'v8';
		const expectedUrl = 'https://api.todoist.com/sync/v8/';
		const actualUrl = getApiUrl(apiVersion);
		expect(actualUrl).toEqual(expectedUrl);
	});

	it('returns the correct URL for a different API version', () => {
		const apiVersion = 'v9';
		const expectedUrl = 'https://api.todoist.com/sync/v9/';
		const actualUrl = getApiUrl(apiVersion);
		expect(actualUrl).toEqual(expectedUrl);
	});

	it('returns the correct URL for a third API version', () => {
		const apiVersion = 'v10';
		const expectedUrl = 'https://api.todoist.com/sync/v10/';
		const actualUrl = getApiUrl(apiVersion);
		expect(actualUrl).toEqual(expectedUrl);
	});
});