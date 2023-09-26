// @ts-nocheck
import { findObject } from './findObject';
import * as Types from '../v9-types';
import { State } from '../v9-interfaces';

describe('findObject', () => {

	// Define a mockState with one entry for each resource type
	const mockState: State = {
		collaborators: [{ id: '1' }],
		collaborator_states: [{ project_id: '1', user_id: '2' }],
		filters: [{ id: '2' }],
		items: [{ id: '3' }],
		labels: [{ id: '4' }],
		live_notifications: [{ id: '5' }],
		notes: [{ id: '6' }],
		project_notes: [{ id: '7' }],
		projects: [{ id: '8' }],
		reminders: [{ id: '9' }],
		sections: [{ id: '10' }]
	};

	// Define a mockState with multiple entries for each resource type
	const multiEntryState = {
		collaborators: [{ id: '1' }, { id: '2' }],
		collaborator_states: [{ project_id: '1', user_id: '2' }, { project_id: '2', user_id: '3' }],
		filters: [{ id: '2' }, { id: '3' }],
		items: [{ id: '3' }, { id: '4' }],
		labels: [{ id: '4' }, { id: '5' }],
		live_notifications: [{ id: '5' }, { id: '6' }],
		notes: [{ id: '6' }, { id: '7' }],
		project_notes: [{ id: '7' }, { id: '8' }],
		projects: [{ id: '8' }, { id: '9' }],
		reminders: [{ id: '9' }, { id: '10' }],
		sections: [{ id: '10' }, { id: '11' }]
	};

	// ... for collaborators ...
	it('should find a collaborator by id', () => {
		const result = findObject('collaborators', { id: '1' }, mockState);
		expect(result).toEqual({ id: '1' });
	});

	it('should not find a collaborator by non-existent id', () => {
		const result = findObject('collaborators', { id: '100' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for collaborator_states ...
	it('should find a collaborator state by project_id and user_id', () => {
		const result = findObject('collaborator_states', { project_id: '1', user_id: '2' }, mockState);
		expect(result).toEqual({ project_id: '1', user_id: '2' });
	});

	it('should not find a collaborator state by non-existent project_id and user_id', () => {
		const result = findObject('collaborator_states', { project_id: '100', user_id: '200' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for filters ...
	it('should find a filter by id', () => {
		const result = findObject('filters', { id: '2' }, mockState);
		expect(result).toEqual({ id: '2' });
	});

	it('should not find a filter by non-existent id', () => {
		const result = findObject('filters', { id: '200' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for items ...
	it('should find an item by id', () => {
		const result = findObject('items', { id: '3' }, mockState);
		expect(result).toEqual({ id: '3' });
	});

	it('should not find an item by non-existent id', () => {
		const result = findObject('items', { id: '300' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for labels ...
	it('should find a label by id', () => {
		const result = findObject('labels', { id: '4' }, mockState);
		expect(result).toEqual({ id: '4' });
	});

	it('should not find a label by non-existent id', () => {
		const result = findObject('labels', { id: '400' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for live_notifications ...
	it('should find a live_notification by id', () => {
		const result = findObject('live_notifications', { id: '5' }, mockState);
		expect(result).toEqual({ id: '5' });
	});

	it('should not find a live_notification by non-existent id', () => {
		const result = findObject('live_notifications', { id: '500' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for notes ...
	it('should find a note by id', () => {
		const result = findObject('notes', { id: '6' }, mockState);
		expect(result).toEqual({ id: '6' });
	});

	it('should not find a note by non-existent id', () => {
		const result = findObject('notes', { id: '600' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for project_notes ...
	it('should find a project_note by id', () => {
		const result = findObject('project_notes', { id: '7' }, mockState);
		expect(result).toEqual({ id: '7' });
	});

	it('should not find a project_note by non-existent id', () => {
		const result = findObject('project_notes', { id: '700' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for projects ...
	it('should find a project by id', () => {
		const result = findObject('projects', { id: '8' }, mockState);
		expect(result).toEqual({ id: '8' });
	});

	it('should not find a project by non-existent id', () => {
		const result = findObject('projects', { id: '800' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for reminders ...
	it('should find a reminder by id', () => {
		const result = findObject('reminders', { id: '9' }, mockState);
		expect(result).toEqual({ id: '9' });
	});

	it('should not find a reminder by non-existent id', () => {
		const result = findObject('reminders', { id: '900' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for sections ...
	it('should find a section by id', () => {
		const result = findObject('sections', { id: '10' }, mockState);
		expect(result).toEqual({ id: '10' });
	});

	it('should not find a section by non-existent id', () => {
		const result = findObject('sections', { id: '1000' }, mockState);
		expect(result).toBeUndefined();
	});

	// ... for unknown resource type ...
	it('should return null for unknown resource type', () => {
		const result = findObject('unknown', { id: '1' }, mockState);
		expect(result).toBeNull();
	});

	// ... for null object ...
	it('should return undefined for null object', () => {
		const result = findObject('collaborators', null, mockState);
		expect(result).toBeUndefined();
	});

	// ... for undefined object ...
	it('should return undefined for undefined object', () => {
		const result = findObject('collaborators', undefined, mockState);
		expect(result).toBeUndefined();
	});

	// ... for null resourceType ...
	it('should return undefined for null resourceType', () => {
		const result = findObject(null, { id: '1' }, mockState);
		expect(result).toBeUndefined(); // Since the switch won't match any case
	});

	// ... for undefined resourceType ...
	it('should return null for undefined resourceType', () => {
		const result = findObject(undefined, { id: '1' }, mockState);
		expect(result).toBeNull(); // Matches the default case
	});

	// ... for empty state ...
	it('should return undefined for empty state', () => {
		const result = findObject('collaborators', { id: '1' }, {});
		expect(result).toBeUndefined();
	});

	// ... for multiple values for 'id' ...
	it('should find the correct collaborator by id from multiple entries', () => {
		const result = findObject('collaborators', { id: '2' }, multiEntryState);
		expect(result).toEqual({ id: '2' });
	});

	// ... for multiple values for 'project_id' and 'user_id' ...
	it('should find the correct collaborator state by project_id and user_id from multiple entries', () => {
		const result = findObject('collaborator_states', { project_id: '2', user_id: '3' }, multiEntryState);
		expect(result).toEqual({ project_id: '2', user_id: '3' });
	});
});
