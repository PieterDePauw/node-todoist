/*
 * simple.js
 */

// IMPORT PACKAGES
const dotenv = require('dotenv')
const path = require('path')
const uuid = require('uuid')
let Todoist = require('../dist/cjs').v9

// LOAD THE ENVIRONMENT VARIABLES
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
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

    //! GET PROJECTS A
  // Use api.items.get() to get all items from the state
  console.log("GET PROJECTS A");
  const projectsA = api.projects.get()
  const projectsASorted = projectsA.map((i, index) => [index, i.id, i.name])
  console.log(projectsASorted)
  console.log("----------------------------------");

  //+ DELAY OF 2 SECONDS
  await delay(2);

  //! ADD NEW ITEM 1
  // Use api.items.add() to add a new item
  const uuidv4 = uuid.v4();
  const newItem = await api.items.add({ content: `NEW ITEM ${uuidv4}!` })
  console.log("ADD NEW ITEM 1");
  console.log(newItem);
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

    //! ADD NEW ITEM 1
  // Use api.items.add() to add a new item
  const newProject = await api.projects.add({ name: `NEW LOCAL PROJECT!` })
  console.log("ADD NEW ITEM 2");
  console.log(newProject);
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

  //! GET LOCAL ITEMS
  // Use api.items.getLocal() to get all local items from the state
  const localItems = api.items.getLocalState()
  console.log("GET LOCAL ITEMS");
  console.log(localItems);
  console.log("----------------------------------");
  
  //! GET LOCAL PROJECTS
  // Use api.items.getLocal() to get all local items from the state
  const localProjects = api.projects.getLocalState()
  console.log("GET LOCAL PROJECTS");
  console.log(localProjects);
  console.log("----------------------------------");

  //+ DELAY OF 5 SECONDS
  await delay(5);

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

  //! GET ITEMS C
  // Use api.items.get() to get all items from the state
  console.log("GET PROJECTS C");
  const projectsC = api.projects.get()
  console.log(projectsC)
  console.log("----------------------------------");
  
})()
