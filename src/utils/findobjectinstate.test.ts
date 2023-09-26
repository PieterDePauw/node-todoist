import { findObject } from './findObject';
import { v9 as Todoist } from '../index';
import { config } from 'dotenv';
import { State } from '../v9-interfaces';
import path from 'path';

// Load environment variables from .env file
config({ path: path.basename(__dirname + '/.env') })
let token = process.env.TODOIST_API_KEY as string

describe('findObjectInState', () => {
	const api = Todoist(token) as ReturnType<typeof Todoist> & {
		findObjectState: (state: State, resourceType: string, id: string, user_id?: string) => any;
	};

	let state: State = api.state();

	beforeEach(async () => {
		// Assuming api.sync() populates the state
		await api.sync();
		state = api.state();  // Assuming there's a method like this
	});

	it('throws an error if the resourceType argument is invalid', () => {
		const errorMessage = 'Invalid resourceType argument: invalid. FindObjectInState requires a string value of a valid resource type as its second argument'
		expect(() => { api.findObjectState(state, 'invalid', '123') }).toThrowError(errorMessage);
	});

	it('throws an error if the id argument is not a string', () => {
		const errorMessage = 'Invalid id argument: FindObjectInState requires a string value as its third argument'
		// @ts-ignore
		expect(() => { api.findObjectState(state, 'items', 123) }).toThrowError(errorMessage);
	});

	it('throws an error if the user_id argument is not a string or undefined', () => {
		const errorMessage = 'Invalid user_id argument: FindObjectInState requires a string value as its optional fourth argument'
		// @ts-ignore
		expect(() => { api.findObjectState(state, 'collaborator_states', '123', 123) }).toThrowError(errorMessage);
	});

	it('returns the correct object when searching for an item by id', () => {
		const item = state.items[0];
		const foundItem = api.findObjectState(state, 'items', item.id);
		expect(foundItem).toEqual(item);
	});

	it('returns the correct object when searching for a collaborator state by project id and user id', () => {
		const collaboratorState = state.collaborator_states[0];
		const foundCollaboratorState = api.findObjectState(state, 'collaborator_states', collaboratorState.project_id, collaboratorState.user_id);
		expect(foundCollaboratorState).toEqual(collaboratorState);
	});
});