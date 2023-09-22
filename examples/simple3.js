// IMPORT PACKAGES
const dotenv = require('dotenv');
const path = require('path');
const Todoist = require('../dist/cjs').v9;

// LOAD ENVIRONMENT VARIABLES
dotenv.config({ path: path.join(__dirname, '../.env') });
const token = process.env.TODOIST_API_KEY;
if (!token) { throw new Error('TODOIST_API_KEY not found in environment variables')	}

// INITIALIZE TODOIST API
const api = Todoist(token);

// UTILITY FUNCTIONS
async function delay(seconds) {
  console.log(`Wait for ${seconds} seconds`);
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  console.log('----------------------------------');
}

// ACTION FUNCTIONS
async function addItem(content) {
  console.log(`Adding new item: ${content}`);
  await api.items.add({ content });
  await delay(5);
}

async function getItems(label) {
  console.log(`Fetching server items: ${label}`);
  const items = api.items.get();
  const sortedItems = items.map((i, index) => [index, i.id, i.content]);
  console.log(sortedItems);
  await delay(5);
}

async function getLocalItems(label) {
  console.log(`Fetching local items: ${label}`);
  const items = api.items.getLocalState();
  const sortedItems = items.map((i, index) => [index, i.id, i.content]);
  console.log(sortedItems);
  await delay(5);
}

async function commitChanges() {
  console.log('Committing changes');
  await api.commit();
  await delay(5);
}

async function syncItems() {
  console.log('Syncing items');
  await api.sync();
  await delay(5);
}

// MAIN EXECUTION

(async () => {
  // Set the sync token for a full sync
  api.syncToken.set('*');
  console.log('Sync token set');
  await delay(5);

  await addItem('NUMMER 0!');
  await syncItems();
  await getItems('A');

  await addItem('VERWIJDERD ITEM 22!');
  await getLocalItems('Local AA');

  await addItem('NUMMER 2!');
  await getLocalItems('Local BB');

  await commitChanges();
  await getItems('B');

  await addItem('NUMMER 3!');
  await getLocalItems('Local CC');

  await syncItems();
  await getLocalItems('Local A');
  await getItems('C');

  await getLocalItems('Local');
  await delay(10);

  const localItems = api.items.getLocalState();
  const deletedTask = localItems.find((item) => item.content === "VERWIJDERD ITEM 22!")
  const deletedId = deletedTask.id
  const deletedItem = await api.items.delete({ id: deletedId });
  console.log("DELETE ITEM");
  console.log(deletedItem);
  console.log('Item deleted');
  console.log("----------------------------------");


  await commitChanges();
  await getItems('D');
})();