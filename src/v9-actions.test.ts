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
		/* 		
				const notes = api.notes.get();
				for (const note of notes) {
					await api.notes.delete({ id: note.id });
				}
				await api.commit(); 
		*/
	});

	it('.add() works', async () => {

	});

	it('.update() works', async () => {

	});

	it('.delete() works', async () => {

	});
});