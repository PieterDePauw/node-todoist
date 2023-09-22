/*
 * simple.js
 */


// IMPORT PACKAGES
import * as url from 'url';
import { config } from 'dotenv'
import { join } from 'path'
import { v9 as Todoist } from '../dist/esm/index.js'

// BUILD THE __dirname AND __filename VARIABLES
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __filename = url.fileURLToPath(import.meta.url);

// LOAD THE ENVIRONMENT VARIABLES
config({ path: join(__dirname, '../.env')})
const token = process.env.TODOIST_API_KEY

// SET UP THE Todoist API
const api = Todoist(token, { autocommit: false, resourceTypes: ['all'] })
// const api = Todoist(token)

// DEFINE A DELAY FUNCTION
async function delay(seconds) {
	console.log("wait for " + seconds + " seconds");
	await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
	console.log("wait OVER");
}

// RUN THE EXAMPLE CODE
;(async () => {

  // Use api.sync() to get the latest state from the server
  await api.sync()
  console.log("sync");

  // Use api.items.get() to get all items from the state
  const items1 = api.items.get()
  console.log("get");
  console.log(items1.map(i => [i.id, i.content]))

  // Use api.items.add() to add a new item
  const newItem = await api.items.add({ content: 'NUMMER 1!' })
  // await api.commit();
  console.log(newItem)

  // Wait for 10 seconds
  await delay(5);

  // Use api.items.add() to add a new item
  const newItem2 = await api.items.add({ cXontent: 'NUMMER 2!' })
  // await api.commit();
  console.log(newItem2)

  // Wait for 10 seconds
  await delay(5);

  //Use api.commit() to commit all changes to the server
  const committedItems = await api.commit()
  console.log("commit");
  //console.log(committedItems);

  // Use api.items.get() to get all items from the state
  const items2 = api.items.get()
  console.log("get");
  console.log(items2.map(i => [i.id, i.content]))

  // Use api.items.add() to add a new item
  const newItem3 = await api.items.add({ content: 'NUMMER 3!' })
  // await api.commit();
  console.log(newItem3)

  // console.log(api.state)
  // console.log(await api.activityLog.get({ object_type: 'project' }))
  // const interval = setInterval(() => {}, 100000)

  // Use api.sync() to get the latest state from the server
  const syncedItems = await api.sync()
  console.log("sync");
  //console.log(syncedItems);
  
  // Use api.items.delete() to delete the new item with the title 'NUMMER 1!'
  const deletedItem = await api.items.delete({ 'id': newItem.temp_id })
  console.log(deletedItem)
  
  const committedItemsB = await api.commit();
  console.log("commit");
  // console.log(committedItemsB["items"].map(i => [i.id, i.content]));

  // Use api.items.get() to get all items from the state
  const items3 = api.items.get()
  console.log("get");
  console.log(items3.map(i => [i.id, i.content]))

})()
