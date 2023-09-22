/*
 * simple.js
 */

// IMPORT PACKAGES
const dotenv = require('dotenv')
const path = require('path')
let Todoist = require('../dist/cjs').v9

// LOAD THE ENVIRONMENT VARIABLES
dotenv.config({ path: path.join(__dirname, '../.env')})
const token = process.env.TODOIST_API_KEY

// SET UP THE TODOIST API
const api = Todoist(token)
// const api = Todoist(token, { "autocommit": false, "resourceTypes": ["all"], "endpoint": "https://api.todoist.com/sync/v9" })

// DEFINE A DELAY FUNCTION
async function delay(seconds) {
	console.log("WAIT FOR " + seconds + " SECONDS");
	await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
	console.log("----------------------------------");
}

// RUN THE EXAMPLE CODE
;(async () => {

  //! SYNC_TOKEN
  // Set the sync token to * to get a full sync
  const returnedToken = api.syncToken.set('*');
  console.log("SYNC TOKEN HAS BEEN SETTED TO:", returnedToken);
  console.log("----------------------------------");

  //! ADD NEW ITEM 0
  // Use api.items.add() to add a new item
  console.log("ADD NEW ITEM 0");
  const newItem0 = await api.items.add({ content: 'NUMMER 0!' })
  console.log(newItem0)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! SYNC
  // Use api.sync() to get the latest state from the server
  await api.sync()
  console.log("SYNC");
  console.log("----------------------------------");

  //! GET ITEMS A
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS A");
  const itemsA = api.items.get()
  const itemsASorted = itemsA.map((i, index) => [index, i.id, i.content])
  console.log(itemsASorted)
  console.log("----------------------------------");

  //! ADD NEW ITEM 1
  // Use api.items.add() to add a new item
  const newItem = await api.items.add({ content: 'VERWIJDERD ITEM!' })
  console.log("ADD NEW ITEM 1");
  console.log(newItem)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS AA
  // Use api.items.getLocalState() to get all local items from the state
  console.log("GET LOCAL ITEMS");
  const localItemsAA = await api.items.getLocalState()
  const localItemsSortedAA = localItemsAA.map((i, index) => [index, i.id, i.content])
  console.log(localItemsSortedAA)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! ADD NEW ITEM 2
  // Use api.items.add() to add a new item
  const newItem2 = await api.items.add({ cXontent: 'NUMMER 2!' })
  console.log("ADD NEW ITEM 2");
  console.log(newItem2)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS BB
  // Use api.items.getLocalState() to get all local items from the state
  console.log("GET LOCAL ITEMS");
  const localItemsBB = api.items.getLocalState()
  const localItemsSortedBB = localItemsBB.map((i, index) => [index, i.id, i.content])
  console.log(localItemsSortedBB)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! COMMIT 1
  // Use api.commit() to commit the changes
  console.log("COMMIT 1");
  const committedItems = await api.commit()
  // console.log("committedItems", committedItems);
  console.log("----------------------------------");

  //! GET ITEMS B
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS B");
  const itemsB = api.items.get()
  const itemsBSorted = itemsB.map((i, index) => [index, i.id, i.content])
  console.log(itemsBSorted)
  console.log("----------------------------------");

  //! ADD NEW ITEM 3
  // Use api.items.add() to add a new item
  const newItem3 = await api.items.add({ content: 'NUMMER 3!' })
  console.log("ADD NEW ITEM 3");
  console.log(newItem3)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS CC
  // Use api.items.getLocalState() to get all local items from the state
  console.log("GET LOCAL ITEMS");
  const localItemsCC = api.items.getLocalState()
  const localItemsSortedCC = localItemsCC.map((i, index) => [index, i.id, i.content])
  console.log(localItemsSortedCC)
  console.log("----------------------------------");

  // console.log(api.state)
  // console.log(await api.activityLog.get({ object_type: 'project' }))
  // const interval = setInterval(() => {}, 100000)

  //! SYNC
  // Use api.sync() to get the latest state from the server
  const syncedItems = await api.sync()
  console.log("SYNC");
  // console.log("synced items", syncedItems);
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS A
  // Use api.items.getLocalState() to get all local items from the state
  console.log("GET LOCAL ITEMS");
  const localItemsA = api.items.getLocalState()
  const localItemsSortedA = localItemsA.map((i, index) => [index, i.id, i.content])
  console.log(localItemsSortedA)
  console.log("----------------------------------");

  //! SYNC
  // Use api.sync() to get the latest state from the server
  const syncedItemsB = await api.sync()
  console.log("SYNC");
  // console.log("synced items", syncedItems);
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);


  //! GET ITEMS C
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS C");
  const itemsC = api.items.get()
  const itemsCSorted = itemsC.map((i, index) => [index, i.id, i.content])
  console.log(itemsCSorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS
  // Use api.items.getLocalState() to get all local items from the state
  console.log("GET LOCAL ITEMS");
  const localItems = api.items.getLocalState()
  const localItemsSorted = localItems.map((i, index) => [index, i.id, i.content])
  console.log(localItemsSorted)
  console.log("----------------------------------");

  //+ DELAY OF 10 SECONDS
  await delay(10);

  //! DELETE ITEM 1 (depends on returning the command from executeCommand)
  // Use api.items.delete() to delete the new item with the title 'NUMMER 1!'
  const deletedTask = localItems.find((item) => item.content === newItem.args["content"])
  const deletedTaskId = deletedTask.id //newItem.temp_id
  const deletedItem = await api.items.delete({ id: deletedTaskId });
  console.log("DELETE ITEM");
  console.log(deletedItem);
  console.log('Item deleted');
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);
  
  //! COMMIT
  // Use api.commit() to commit the changes
  console.log("COMMIT 2");
  const committedItemsB = await api.commit();
  // console.log(committedItemsB["items"].map(i => [i.id, i.content]));
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET ITEMS D
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS D");
  const itemsD = api.items.get()
  const itemsDSorted = itemsD.map((i, index) => [index, i.id, i.content])
  console.log(itemsDSorted)
  console.log("----------------------------------");

})()
