import * as chrono from 'chrono-node';
import { v9 as Todoist } from './index';
import { config } from 'dotenv';
import { Item, ItemAdd, DueDateInputString } from './v9-types'; // Import the types you defined
import { Command, State } from './v9-interfaces'
import path from 'path';
import moment from 'moment';
import { error } from 'console';

// Load environment variables from .env file
config({ path: path.basename(__dirname + '/.env') })
let api: any;
let token = process.env.TODOIST_API_KEY as string

// 
describe('initialization', () => {
  it('fails with invalid api key', () => {
    expect(() => {
      api = Todoist('invalid');
    }).toThrow();
  });

  it('works', () => {
    api = Todoist(process.env.TODOIST_API_KEY as string);
  });

  it('.sync() properly', async () => {
    api = Todoist(token);
    await api.sync();
  });
});

// TESTS WITH REGARDS TO PROJECTS
describe('.items CRUD', () => {
  api = Todoist(token) as ReturnType<typeof Todoist>;
  let newItem: Item | undefined;
  let addedItem: Command

  it('.get() returns data', () => {
    const items = api.items.get();
    expect(items).toBeInstanceOf(Array);
  });

  it('.add() works', async () => {
    const itemToAdd: ItemAdd = { content: 'testing-task-item' };  // Use the ItemAdd type you defined
    addedItem = await api.items.add(itemToAdd);
    await api.commit();
    await api.sync();
    newItem = api.items.get().find((item: { content: string; }) => item.content === itemToAdd.content);
    expect(newItem).toMatchObject({ content: 'testing-task-item' });
  });

  it('.delete() works', async () => {
    const itemToAdd: ItemAdd = { content: 'testing-task-item2' };  // Use the ItemAdd type you defined
    addedItem = await api.items.add(itemToAdd);
    await api.commit();
    await api.sync("*");
    const addedItemCommited = api.items.get().find((item: { content: string; }) => item.content === itemToAdd.content)!;
    await api.items.delete({ id: addedItemCommited.id });
    await api.commit();
    await api.sync("*")
    const deletedItem = api.items.get().find((item: { id: string }) => item.id === addedItemCommited.id);
    expect(deletedItem).toBeUndefined();
  });
});

describe('.items due dates', () => {
  let item: Item | undefined;
  const itemContent = "EXPECTED ITEM"; // The content of the item you want to add
  const now = Date.now();              // The current date and time

  // Expected values
  const expectedDateTimeString = '14 May 2024 07:06';
  const expectedDueDateISOStringWithoutMiliseconds = '2024-05-14T07:06:00';

  afterEach(async () => {
    if (item) {
      await api.items.delete({ id: item.id });
    }
  });

  it('.add() with string due date', async () => {

    // Provide a natural language description of the due date and other parameters
    const dateTimeString = "14 May 2024 07:06";

    // Parse the natural language description into a Date object
    const dateTimeInput = chrono.parse(dateTimeString, { instant: new Date(now), timezone: "GMT" });


    // Add the task, commit, sync, get the items list, and find the item you added
    const itemToAdd = await api.items.add({ content: itemContent, due: { string: expectedDateTimeString } });
    await api.commit();
    await api.sync();

    // Get the item you added
    const items = api.items.get();
    const addedItem = items.find((item: { content: string; }) => item.content === itemContent);
    const addedItemDue = addedItem!.due;

    expect(addedItemDue).toEqual({
      date: expectedDueDateISOStringWithoutMiliseconds,
      is_recurring: false,
      lang: 'en',
      string: expectedDateTimeString,  // This should match what you added
      timezone: null,
    });
  });

});

describe('findObjectInState', () => {
  api = Todoist(token) as ReturnType<typeof Todoist> & {
    findObjectState: (resourceType: string, id: string, user_id?: string) => any;
  };

  let state: State;

  beforeEach(async () => {
    // Assuming api.sync() populates the state
    await api.sync();
    state = api.state();  // Assuming there's a method like this
  });

  it('throws an error if the resourceType argument is invalid', () => {
    const errorMessage = 'Invalid resourceType argument: invalid. FindObjectInState requires a string value of a valid resource type as its first argument'
    expect(() => { api.findObjectState('invalid', '123') }).toThrowError(errorMessage);
  });

  it('throws an error if the id argument is not a string', () => {
    const errorMessage = 'Invalid id argument: FindObjectInState requires a string value as its second argument'
    expect(() => { api.findObjectState('items', 123) }).toThrowError(errorMessage);
  });

  it('throws an error if the user_id argument is not a string or undefined', () => {
    const errorMessage = 'Invalid user_id argument: FindObjectInState requires a string value as its optional third argument'
    expect(() => { api.findObjectState('collaborator_states', '123', 123) }).toThrowError(errorMessage);
  });

  it('returns the correct object when searching for an item by id', () => {
    const item = state.items[0];
    const foundItem = api.findObjectState('items', item.id);
    expect(foundItem).toEqual(item);
  });

  it('returns the correct object when searching for a collaborator state by project id and user id', () => {
    const collaboratorState = state.collaborator_states[0];
    const foundCollaboratorState = api.findObjectState('collaborator_states', collaboratorState.project_id, collaboratorState.user_id);
    expect(foundCollaboratorState).toEqual(collaboratorState);
  });
});