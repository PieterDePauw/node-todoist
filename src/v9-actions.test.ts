import { v9 as Todoist } from './index';
import { config } from 'dotenv';
import * as Types from './v9-types';
import path from 'path';

// Load environment variables from .env file
config({ path: path.basename(__dirname + '/.env') })

type ApiType = ReturnType<typeof Todoist>;
let api: ApiType;
let token = process.env.TODOIST_API_KEY as string

describe('notes', () => {
	beforeEach(async () => {
		api = Todoist(token);
		await api.sync();
	});

	afterEach(async () => {
		await api.sync();
		const notes = api.notes.get();
		for (const note of notes) {
			await api.notes.delete({ id: note.id });
		}
		await api.commit();
	});

	it('.add() works', async () => {
		const noteToAdd = { content: 'testing-note', item_id: 'item_id' };
		const addedNote = await api.notes.add(noteToAdd);
		await api.commit();
		await api.sync();
		const notes = api.notes.get();
		const expectedNote = notes.find((note) => note.content === 'testing-note');

		expect(expectedNote).toContainEqual(addedNote);
	});

	it('.update() works', async () => {
		const noteToAdd = { content: 'testing-note', item_id: 'item_id' };
		const addedNote = await api.notes.add(noteToAdd);
		const updatedNote = await api.notes.update({ id: addedNote.uuid, content: 'updated-note' });
		await api.commit();
		await api.sync();
		const notes = api.notes.get();
		const expectedNote = notes.find((note) => note.content === 'updated-note');

		expect(expectedNote).toContainEqual(updatedNote);
	});

	it('.delete() works', async () => {
		const noteToAdd = { content: 'testing-note', item_id: 'item_id' };
		const addedNote = await api.notes.add(noteToAdd);
		await api.notes.delete({ id: addedNote.uuid });
		await api.commit();
		await api.sync();
		const notes = api.notes.get();
		const deletedNote = notes.find((note) => note.content === 'updated-note');

		expect(deletedNote).toBeUndefined();
	});
});