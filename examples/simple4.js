/*
 * simple.js
 */

// IMPORT PACKAGES
const { log } = require('console')
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

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! SYNC
  // Use api.sync() to get the latest state from the server
  await api.commit()
  console.log("SYNC – COMMIT");
  console.log("----------------------------------");

  //! GET ITEMS A
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS A");
  const itemsA = api.items.get()
  const itemsASorted = itemsA.map((i, index) => [index, i.id, i.content, i.checked])
  console.log(itemsASorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! ADD NEW ITEM 1
  // Use api.items.add() to add a new item
  const itemToAdd = { content: 'COMPLETED ITEM!' }
  const content = itemToAdd.content
  const newItem = await api.items.add(itemToAdd)
  console.log("ADD NEW ITEM 1");
  // console.log(newItem);
  const newItemSorted = newItem["items"].map((i, index) => [index, i.id, i.content, i.checked])
  console.log(newItemSorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //+ SYNC
  // Use api.sync() to get the latest state from the server
  await api.commit()
  console.log("SYNC – COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET ITEMS B
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS B");
  const itemsB = api.items.get()
  const itemsBSorted = itemsB.map((i, index) => [index, i.id, i.content, i.checked])
  console.log(itemsBSorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET ITEMS B2
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS B2");
  const itemsB2 = api.items.get()
  const itemsB2Sorted = itemsB.map((i, index) => [index, i.id, i.content, i.checked])
  console.log(itemsB2Sorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! Get item by content string
  const itemToClose = (itemsB2).find(item => item["content"] === content)
  console.log("ITEM TO CLOSE", itemToClose);
  const itemToCloseId = itemToClose["id"]
  console.log(itemToCloseId);

  //! CLOSE ITEM
  // Use api.items.close() to close an item
  const closedItem = await api.items.close({ id: itemToCloseId})
  console.log("CLOSE ITEM");
  // console.log(closedItem);
  const closedItemSorted = closedItem["items"].map((i, index) => [index, i.id, i.content, i.checked])
  console.log(closedItemSorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET ITEMS C
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS C");
  const itemsC = api.items.get()
  const itemsCSorted = itemsC.map((i, index) => [index, i.id, i.content, i.checked])
  console.log(itemsCSorted)
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET ITEMS D
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS D");
  const itemsD = api.items.get()
  const itemsDSorted = itemsD.map((i, index) => [index, i.id, i.content, i.checked])
  console.log(itemsDSorted)
  console.log("----------------------------------");
  
})()
