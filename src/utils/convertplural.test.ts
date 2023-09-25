import { getResourceTypePlural } from './convertplural';

describe('getResourceTypePlural', () => {
	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'collaborator';
		const expectedPluralForm = 'collaborators';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'filter';
		const expectedPluralForm = 'filters';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'item';
		const expectedPluralForm = 'items';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'label';
		const expectedPluralForm = 'labels';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'live_notifications';
		const expectedPluralForm = 'live_notifications';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'note';
		const expectedPluralForm = 'notes';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'project';
		const expectedPluralForm = 'projects';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'project_note';
		const expectedPluralForm = 'project_notes';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'reminder';
		const expectedPluralForm = 'reminders';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'section';
		const expectedPluralForm = 'sections';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'user';
		const expectedPluralForm = 'user';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('returns the correct plural form for a valid singular resource type', () => {
		const singularResourceType = 'user_settings';
		const expectedPluralForm = 'user_settings';
		const actualPluralForm = getResourceTypePlural(singularResourceType);
		expect(actualPluralForm).toEqual(expectedPluralForm);
	});

	it('throws an error for an invalid singular resource type', () => {
		const singularResourceType = 'invalid_resource_type';
		// @ts-expect-error
		expect(() => getResourceTypePlural(singularResourceType)).toThrow(`Plural form not found for resource type: ${singularResourceType}`);
	});
});