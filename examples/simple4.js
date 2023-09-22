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

  //+ DELAY OF 2 SECONDS
  await delay(2);

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

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //! ADD NEW ITEM 1
  // Use api.items.add() to add a new item
  const newItem = await api.items.add({ content: 'COMPLETED ITEM!' })
  console.log("ADD NEW ITEM 1");
  console.log(newItem);
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //! GET ITEMS B
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS B");
  const itemsB = api.items.get()
  const itemsBSorted = itemsB.map((i, index) => [index, i.id, i.content])
  console.log(itemsBSorted)
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //! Get item by content string
  const itemToClose = itemsB.find((item) => item.content === "COMPLETED ITEM!")
  console.log("ITEM TO CLOSE", itemToClose);
  const itemToCloseId = itemToClose.id
  console.log(itemToCloseId);

  //! CLOSE ITEM
  // Use api.items.close() to close an item
  const closedItem = await api.items.complete({ id: itemToCloseId})
  console.log("CLOSE ITEM");
  console.log(closedItem);
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //+ COMMIT
  // Use api.commit() to commit the changes
  await api.commit()
  console.log("COMMIT");
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //! GET ITEMS C
  // Use api.items.get() to get all items from the state
  console.log("GET ITEMS C");
  const itemsC = api.items.get()
  const itemsCSorted = itemsC.map((i, index) => [index, i.id, i.content])
  console.log(itemsCSorted)
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);
  
})()
