import * as Types from './v9-types';
import { ActionFunctions } from './v9-interfaces';

// Define the common helper functions
const findIndexById = (array: any[], id: any) => array.findIndex(item => item.id === id);

const addObjectToArray = (array: any[], object: any, temp_id?: any) => {
	if (temp_id) { object.id = temp_id };
	array.push(object);
};

const updateObjectInArray = (array: any[], id: any, updatedProperties: any) => {
	const index = findIndexById(array, id);
	if (index === -1) { throw new Error(`Object with id ${id} not found`); }
	array[index] = { ...array[index], ...updatedProperties };
};

const deleteObjectFromArray = (array: any[], id: any) => {
	const index = findIndexById(array, id);
	if (index === -1) { throw new Error(`Object with id ${id} not found`); }
	array.splice(index, 1);
};



// Define the action functions for each resource type
export const actionFunctions: ActionFunctions = {
	projects: {
		add: (localState, command) => {
			// Add all default attributes to a new resource object
			const defaultAttributes = {
				"name": "",
				"description": "",
				"parent_id": null,
				"collapsed": false,
				"shared": false,
				"is_deleted": false,
				"is_archived": false,
				"is_favorite": false,
				"view_style": "list",
			};
			// Create a new resource object to add to the local state
			const {
				"name": name,
				"parent_id": parent_id,
				"child_order": child_order
			} = command.args as Types.ProjectAdd;
			// Create a new resource object to add to the local state
			const projectToAdd = command.args as Types.ProjectAdd;
			// Add a temporary id to the resource object
			const projectToAddId = command["temp_id"];
			// If the item or the id is not defined, throw an error
			if (!projectToAdd || !projectToAddId) { throw new Error(`Item or id not defined`) }
			// Create a new resource object to add to the local state
			const addedProject = Object.assign({}, defaultAttributes, command.args as Types.ProjectAdd, { "id": command.temp_id }) as Types.Project;
			// Add the item to the local state
			localState["projects"].push(addedProject);
			// Return the item
			return addedProject;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const projectToUpdateIndex = localState.projects.findIndex((project: Types.Project) => project.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (projectToUpdateIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`); }
			// >> Create a new resource object to update the local state
			const updatedProject = Object.assign({}, localState.projects[projectToUpdateIndex], command.args);
			// >> Update the array of local resource objects with the updated resource object
			localState.projects[projectToUpdateIndex] = updatedProject;
			// >> Return the updated resource object
			return updatedProject;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const projectToDeleteIndex = localState.projects.findIndex((project: Types.Project) => project.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (projectToDeleteIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			// >> Find the resource object to delete
			const projectToDelete = localState.projects[projectToDeleteIndex];
			// >> Delete the resource object from the local state
			localState.projects.splice(projectToDeleteIndex, 1);
			// localState.projects = localState.projects.filter((project: Types.Project) => project.id !== projectToDelete.id);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
		archive: (localState, command) => {
			// >> Find the index of the item to archive
			const projectToArchiveIndex = localState.projects.findIndex((project: Types.Project) => project.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (projectToArchiveIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			// >> Find the resource object that will be archived
			const projectToUpdate = localState.projects[projectToArchiveIndex]
			// >> Create a new resource object to archive in the local state
			const updatedProject = Object.assign({}, { ...projectToUpdate, "is_archived": true })
			// >> Return the archived resource object
			return updatedProject;
		},
		unarchive: (localState, command) => {
			// >> Find the index of the item to unarchive
			const projectToUnarchiveIndex = localState.projects.findIndex((project: Types.Project) => project.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (projectToUnarchiveIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			// >> Find the resource object that will be unarchived
			const projectToUnarchive = localState.projects[projectToUnarchiveIndex]
			// >> Create a new resource object to unarchive in the local state
			const unarchivedProject = Object.assign({}, { ...projectToUnarchive, "is_archived": false });
			// >> Return the unarchived resource object
			return unarchivedProject;
		},
		move: (localState, command) => {
			// >> Find the index of the item to move
			const projectToMoveIndex = localState.projects.findIndex((project: Types.Project) => project.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (projectToMoveIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			// >> Find the resource object that will be moved
			const ProjectToMove = localState.projects[projectToMoveIndex];
			// >> Create a new resource object to move in the local state
			const movedProject = Object.assign({}, { ...ProjectToMove, "parent_id": command.args.parent_id });
			// >> Cut the resource object at its current position
			// const [project] = localState.projects.splice(projectToMoveIndex, 1);
			// >> Insert the resource object at the new position
			// localState.projects.splice(newOrder, 0, project);
			// >> Return the moved resource object
			return movedProject;
		},
		reorder: (localState, command) => {
			// An array of objects to update. Each object contains two attributes: id of the project to update and child_order, the new order.
			const projectOrderMapping: { "id": string, "child_order": number }[] = command.args.projects
			// Loop over the projectOrderMapping array
			projectOrderMapping.forEach(({ id, child_order }) => {
				// >> Find the index of the resource object to update
				const projectToUpdateIndex = localState.projects.findIndex((project: Types.Project) => project.id === id);
				// >> If the item does not exist, throw an error
				if (projectToUpdateIndex === -1) { throw new Error(`Project with id ${id} not found`) }
				// >> Find the resource object to update
				const projectToUpdate = localState.projects[projectToUpdateIndex]
				// >> Create a new resource object to update the local state
				const updatedProject = Object.assign({}, { ...projectToUpdate, "child_order": child_order })
				// >> Update the array of local resource objects with the updated resource object
				localState.projects[projectToUpdateIndex] = updatedProject;
			});
			// Sort the local state.projects array by the child_order attribute
			localState.projects = localState.projects.sort((a, b) => a.child_order - b.child_order);
		}
	},
	items: {
		add: (localState, command) => {
			// Add all default attributes to a new resource object
			const defaultAttributes = {
				"id": "",
				"content": "",
				"checked": false,
				"collapsed": false,
				"completed_at": null,
				"description": "",
				"due": null,
				"duration": null,
				"is_deleted": false,
				"labels": [],
				"parent_id": null,
				"priority": 1,
				"project_id": null,
				"section_id": null,
				"user_id": null,
				"in_history": 0,
				"sync_id": null,
				"child_order": 0,
				"day_order": 0,
				"added_at": "",
			} as unknown as Types.Item;
			// Create a new resource object to add to the local state
			const itemToAdd = command.args as Types.Item
			// Add a temporary id to the resource object
			const itemToAddId = { "id": command.temp_id! } as Types.Item;
			// If the item or the id is not defined, throw an error
			if (!itemToAdd || !itemToAddId) { throw new Error(`Item or id not defined`) }
			// Create a new resource object to add to the local state
			const addedItem = Object.assign(defaultAttributes, itemToAdd, itemToAddId);
			// Add the item to the local state
			localState.items.push(addedItem);
			// Return the item
			return addedItem;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const index = localState.items.findIndex((item: Types.Item) => item.id === command["args"].id);
			// If the item does not exist, throw an error
			if (index === -1) { throw new Error(`Item with id ${command.args.id} not found`) }
			// >> Find the resource object that will be updated
			const itemToUpdate = localState.items[index]
			// >> Create a new resource object to update the local state
			const updatedItem = Object.assign({}, itemToUpdate, command.args);
			// >> Return the updated resource object
			return updatedItem;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const itemToDeleteIndex = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (itemToDeleteIndex === -1) { throw new Error(`Item with id ${command.args.id} not found`); }
			// >> Delete the resource object from the local state
			localState.projects.splice(itemToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
		move: (localState, command) => {
			// >> Find the index of the resource object to move
			const itemToMoveIndex = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);

			// >> If the resource object does not exist, throw an error
			if (itemToMoveIndex === -1) { throw new Error(`Item with id ${command.args.id} not found`) }

			// >> Find the resource object that will be moved
			const itemToMove = localState.items[itemToMoveIndex];

			// >> Find whether the parent_id, section_id or project_id has been set in the command.args
			const newParentId = command.args.parent_id;
			const newSectionId = command.args.section_id;
			const newProjectId = command.args.project_id;

			/*
			// Check if the parent_id has been set in the command.args
			if (newParentId) {
				// >> Create a new resource object to move in the local state
				const movedItem = Object.assign({}, { ...itemToMove, "parent_id": newParentId });

				// >> Remove the resource object at its current position
				localState.items.splice(itemToMoveIndex, 1);

				// >> Insert the resource object at the new position
				localState.items.splice(command.args.newPosition, 0, movedItem);

				// >> Return the moved resource object
				return movedItem;
			}
			// Check if the section_id has been set in the command.args
			if (newSectionId) {
				// >> Create a new resource object to move in the local state
				const movedItem = Object.assign({}, { ...itemToMove, "section_id": newSectionId });

				// >> Remove the resource object at its current position
				localState.items.splice(itemToMoveIndex, 1);

				// >> Insert the resource object at the new position
				localState.items.splice(command.args.newPosition, 0, movedItem);

				// >> Return the moved resource object
				return movedItem;
			}
			// Check if the project_id has been set in the command.args
			if (newProjectId) {
				// >> Create a new resource object to move in the local state
				const movedItem = Object.assign({}, { ...itemToMove, "project_id": newProjectId });

				// >> Remove the resource object at its current position
				localState.items.splice(itemToMoveIndex, 1);

				// >> Insert the resource object at the new position
				localState.items.splice(command.args.newPosition, 0, movedItem);

				// >> Return the moved resource object
				return movedItem;
			}
			*/

			// >> Create a new resource object to move in the local state
			const movedItem = Object.assign({}, { ...itemToMove, "parent_id": command.args.parent_id });

			// >> Remove the resource object at its current position
			localState.items.splice(itemToMoveIndex, 1);

			// >> Insert the resource object at the new position
			// localState.items.splice(itemToMoveNewIndex, 0, movedItem);

			// >> Add the item to the local state
			localState.items.push(movedItem);

			// >> Return the moved resource object
			return movedItem;
		},
		close: (localState, command) => {
			// >> Find the index of the resource object to close
			const index = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (index === -1) { throw new Error(`Item with id ${command.args.id} not found`) }
			// >> Find the resource object that will be closed
			const itemToClose = localState.items[index];
			// >> Create a new resource object to close in the local state
			const closedItem = Object.assign({}, { ...itemToClose, "checked": true, "completed_at": new Date().toISOString() });
			localState.items[index].checked = true;
			localState.items[index].in_history = true;
		},
		complete: (localState, command) => {
			// >> Find the index of the resource object to complete
			const itemToCompleteIndex = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (itemToCompleteIndex === -1) { throw new Error(`Item with id ${command.args.id} not found`) }
			// >> Find the resource object that will be completed
			const itemToComplete = localState.items[itemToCompleteIndex];
			// >> Create a new resource object to complete in the local state
			const completedItem = Object.assign({}, { ...itemToComplete, "checked": true, "completed_at": new Date().toISOString() });
			// >> Return the completed resource object
			return completedItem;
		},
		uncomplete: (localState, command) => {
			// >> Find the index of the resource object to uncomplete
			const itemToUncompleteIndex = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (itemToUncompleteIndex === -1) { throw new Error(`Item with id ${command.args.id} not found`) }
			// >> Find the resource object that will be uncompleted
			const itemToUncomplete = localState.items[itemToUncompleteIndex];
			// >> Create a new resource object to uncomplete in the local state
			const uncompletedItem = Object.assign({}, { ...itemToUncomplete, "checked": false, "completed_at": null });
			// >> Return the uncompleted resource object
			return uncompletedItem;
		},
		/*
		archive: (localState, command) => {
			const itemToArchiveIndex = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			if (itemToArchiveIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			const itemToArchive = localState.items[itemToArchiveIndex]
			itemToArchive.is_archived = true
			const archivedItem = 
		unarchive: (localState, command) => {
			const index = localState.items.findIndex((item: Types.Item) => item.id === command.args.id);
			if (index === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			localState.items[index].is_archived = false;
		},
		*/
		reorder: (localState, command) => {
			// Assign the id order mapping to a variable
			const ItemOrderMapping: { id: string, child_order: number }[] = command.args.items

			// Loop over the ItemOrderMapping array to update the child_order of each item
			ItemOrderMapping.forEach(({ id, child_order }) => {
				const itemToUpdateIndex = localState.items.findIndex((item: Types.Item) => item.id === id);
				if (itemToUpdateIndex === -1) { throw new Error(`Project with id ${id} not found`) }
				localState.items[itemToUpdateIndex].child_order = child_order;
			});

			// Sort the local state.items array by the child_order attribute
			localState.items = localState.items.sort((a, b) => a.child_order - b.child_order);
		},
		updateDayOrders: (localState, command) => {
			// Implementation for updating item day orders
		},
		updateDateCompleted: (localState, command) => {
			// Implementation for updating item date completed
		}
	},
	sections: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedSection = Object.assign(command.args, { id: command.temp_id }) as Types.Section;
			// >> Add the item to the local state
			localState.sections.push(addedSection);
			// >> Return the item
			return addedSection;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const sectionToUpdateIndex = localState.sections.findIndex((section: Types.Section) => section.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (sectionToUpdateIndex === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const sectionToUpdate = localState.sections[sectionToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedSection = Object.assign({}, sectionToUpdate, command.args);
			// >> Return the updated resource object
			return updatedSection;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const sectionToDeleteIndex = localState.sections.findIndex((section: Types.Section) => section.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (sectionToDeleteIndex === -1) { throw new Error(`Section with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			localState.sections.splice(sectionToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
		archive: (localState, command) => {
			// >> Find the index of the resource object to archive
			const sectionToArchiveIndex = localState.sections.findIndex((section: Types.Section) => section.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (sectionToArchiveIndex === -1) { throw new Error(`Section with id ${command.args.id} not found`) }
			// >> Find the resource object that will be archived
			const sectionToArchive = localState.sections[sectionToArchiveIndex];
			// >> Create a new resource object to update the local state
			const archivedSection = { ...sectionToArchive, "is_archived": true };
			// Return the updated resource object
			return archivedSection;

		},
		unarchive: (localState, command) => {
			// >> Find the index of the resource object to archive
			const sectionToUnarchiveIndex = localState.sections.findIndex((section: Types.Section) => section.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (sectionToUnarchiveIndex === -1) { throw new Error(`Section with id ${command.args.id} not found`) }
			// >> Find the resource object that will be archived
			const sectionToUnarchive = localState.sections[sectionToUnarchiveIndex];
			// >> Create a new resource object to update the local state
			const unarchivedSection = { ...sectionToUnarchive, "is_archived": false };
			// Return the updated resource object
			return unarchivedSection;
		},
		move: (localState, command) => {
			const index = localState.sections.findIndex((section: Types.Section) => section.id === command.args.id);
			if (index === -1) { throw new Error(`Project with id ${command.args.id} not found`) }
			const [section] = localState.sections.splice(index, 1);
			localState.sections.splice(command.args.newPosition, 0, section);
		},
		reorder: (localState, command) => {
			// For this example, assume command.args contains an array of section IDs in the new order
			localState.sections.sort((a, b) => command.args.indexOf(a.id) - command.args.indexOf(b.id));
		}
	},
	labels: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedLabel = Object.assign(command.args, { id: command.temp_id }) as Types.Label;
			// >> Add the item to the local state
			localState.labels.push(addedLabel);
			// >> Return the item
			return addedLabel;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const labelToUpdateIndex: number = localState.labels.findIndex((label: Types.Label) => label.name === command.args.name_old);
			// >> If the item does not exist, throw an error
			if (labelToUpdateIndex === -1) { throw new Error(`Label with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const labelToUpdate: Types.Label = localState.labels[labelToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedLabel: Types.Label = Object.assign({}, { ...labelToUpdate, "name": command.args.name_new });
			// >> Update the array of local resource objects with the updated resource object
			return updatedLabel;

		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const labelToDeleteIndex: number = localState.labels.findIndex((label: Types.Label) => label.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (labelToDeleteIndex === -1) { throw new Error(`Label with id ${command.args.id} not found`) }
			// >> Find the resource object to delete
			const labelToDelete: Types.Label = localState.labels[labelToDeleteIndex];
			// >> Create a new resource object to update the local state
			const deletedLabel: Types.Label = { ...labelToDelete, "is_deleted": true };
			// >> Delete the resource object from the local state
			localState.labels.splice(labelToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
		rename: (localState, command) => {
			// >> Find the index of the resource object to rename
			const renamedLabelIndex = localState.labels.findIndex((label: Types.Label) => label.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (renamedLabelIndex === -1) { throw new Error(`Label with id ${command.args.id} not found`) }
			// >> Find the resource object to rename
			const renamedLabel = localState.labels[renamedLabelIndex];
			// >> Create a new resource object to update the local state
			const updatedLabel = { ...renamedLabel, name: command.args.name };
			// >> Update the array of local resource objects with the updated resource object
			localState.labels[renamedLabelIndex] = updatedLabel;
			// >> Return the updated resource object
			return updatedLabel;
		},
		updateOrders: (localState, command) => {
			// >> Assign the id order mapping to a variable
			const idOrderMapping = command.args.id_order_mapping;
			// >> Assign the keys of the id order mapping to a variable (= the id's of all labels)
			const labelIds = Object.keys(idOrderMapping);
			// >> Loop over all label id's in the id order mapping to update the item_order of each label
			labelIds.forEach((labelId) => {
				// >> Find the index of the resource object to update
				const labelToUpdateIndex: number = localState.labels.findIndex((label: Types.Label) => label.id === labelId);
				// >> If the item does not exist, throw an error
				if (labelToUpdateIndex === -1) { throw new Error(`Label with id ${labelId} not found`) }
				// >> Find the resource object to update
				const labelToUpdate: Types.Label = localState.labels[labelToUpdateIndex];
				// const labelToUpdate: Types.Label = localState.labels.filter((label: Types.Label) => label.id === labelId;
				// >> Find the new item_order of the filter whose id is currently being looped over
				const newOrder = idOrderMapping[labelId];
				// >> If the order of the label is not found, throw an error
				if (!newOrder) { throw new Error(`Label with id ${labelId} has no corresponding updated item_order`) }
				// >> Create a new resource object to update the local state
				const updatedLabel: Types.Label = Object.assign({}, { ...labelToUpdate, "item_order": newOrder });
				// >> Return the updated resource object
				return updatedLabel;
			});
			// >> Sort the label objects in the labels array, based on the value of their item_order property
			const updatedLabels = localState.labels.sort((a, b) => b.item_order - a.item_order);
			// >> Return the updated labels array
			return updatedLabels;
		},
	},
	collaborators: {
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const collaboratorToDeleteIndex = localState.collaborators.findIndex((collaborator: Types.Collaborator) => collaborator.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (collaboratorToDeleteIndex === -1) { throw new Error(`Collaborator with id ${command.args.id} not found`) }
			// >> Find the resource object to delete
			// const collaboratorToDelete = localState.collaborators[collaboratorToDeleteIndex];
			// >> Delete the resource object from the local state
			localState.collaborators.splice(collaboratorToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		}
	},
	filters: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedFilter = Object.assign({}, { ...command.args, "id": command.temp_id }) as Types.Filter;
			// >> Add the item to the local state
			localState.filters.push(addedFilter);
			// >> Return the item
			return addedFilter;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const filterToUpdateIndex = localState.filters.findIndex((filter: Types.Filter) => filter.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (filterToUpdateIndex === -1) { throw new Error(`Filter with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const filterToUpdate = localState.filters[filterToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedFilter = Object.assign({}, filterToUpdate, command.args);
			// >> Return the updated resource object
			return updatedFilter;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const filterToDeleteIndex = localState.filters.findIndex((filter: Types.Filter) => filter.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (filterToDeleteIndex === -1) { throw new Error(`Filter with id ${command.args.id} not found`) }
			// >> Delete the resource object from the local state
			localState.filters.splice(filterToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
		updateOrders: (localState, command) => {
			// >> Assign the id order mapping to a variable
			const idOrderMapping = command.args.id_order_mapping;

			// >> Assign the keys of the id order mapping to a variable (= the id's of all filters)
			const filterIds = Object.keys(idOrderMapping);

			// >> Loop over all filter id's in the id order mapping to update the item_order of each filter
			filterIds.forEach((filterId) => {
				// >>> Find the index of the resource object to update
				const filterToUpdateIndex: number = localState.filters.findIndex((filter: Types.Filter) => filter.id === filterId);
				if (filterToUpdateIndex === -1) { throw new Error(`Filter with id ${filterId} not found`) }

				// >>> Find the filter object to update based on the filter id that is currently being looped over
				const filterToUpdate = localState.filters.find((filter: Types.Filter) => filter.id === filterId); 	// === localState.filters[filterToUpdateIndex]
				if (!filterToUpdate) { throw new Error(`Filter with id ${filterId} not found`) }

				// >>> Find the new item_order of the filter whose id is currently being looped over
				const newOrder = idOrderMapping[filterId];
				if (!newOrder) { throw new Error(`Filter with id ${filterId} has no corresponding updated item_order`) }

				// >> Update the item_order of each filter
				const updatedFilter: Types.Filter = Object.assign({}, { ...filterToUpdate, "item_order": newOrder })

				// >>> Update the array of local resource objects with the updated resource object
				localState.filters[filterToUpdateIndex] = updatedFilter;
			});

			// >> Sort the filter objects in the filters array, based on the value of their item_order property
			const updatedFilters = localState.filters.sort((a, b) => b.item_order - a.item_order);

			// >> Return the updated filters array
			return updatedFilters;
		},

		reorder: (localState, command) => {
			// For this example, assume command.args contains an array of filter IDs in the new order
			localState.filters.sort((a, b) => command.args.indexOf(a.id) - command.args.indexOf(b.id));
		},
	},
	live_notifications: {},
	notes: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedNote = Object.assign({}, { ...command.args, id: command.temp_id }) as Types.Note;
			// >> Add the resource item to the local state
			localState.notes.push(addedNote);
			// >> Return the resource item
			return addedNote;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const noteToUpdateIndex = localState.notes.findIndex((note: Types.Note) => note.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (noteToUpdateIndex === -1) { throw new Error(`Note with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const noteToUpdate = localState.notes[noteToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedNote = Object.assign({}, noteToUpdate, command.args);
			// >> Return the updated resource object
			return updatedNote;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const noteToDeleteIndex = localState.notes.findIndex((note: Types.Note) => note.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (noteToDeleteIndex === -1) { throw new Error(`Note with id ${command.args.id} not found`) }
			// >> Delete the resource object from the local state
			localState.notes.splice(noteToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
	},
	project_notes: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedProjectNote = Object.assign(command.args, { id: command.temp_id }) as Types.ProjectNote;
			// >> Add the resource item to the local state
			localState.project_notes.push(addedProjectNote);
			// >> Return the resource item
			return addedProjectNote;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const projectNoteToUpdateIndex = localState.project_notes.findIndex((project_note: Types.ProjectNote) => project_note.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (projectNoteToUpdateIndex === -1) { throw new Error(`Project note with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const projectNoteToUpdate = localState.project_notes[projectNoteToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedNote = Object.assign({}, projectNoteToUpdate, command.args);
			// >> Return the updated resource object
			return updatedNote;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const projectNoteToDeleteIndex = localState.project_notes.findIndex((project_note: Types.ProjectNote) => project_note.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (projectNoteToDeleteIndex === -1) { throw new Error(`Project note with id ${command.args.id} not found`) }
			// >> Delete the resource object from the local state
			localState.project_notes.splice(projectNoteToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
	},
	reminders: {
		add: (localState, command) => {
			// >> Create a new resource object to add to the local state
			const addedReminder = Object.assign(command.args, { id: command.temp_id }) as Types.Reminder;
			// >> Add the item to the local state
			localState.reminders.push(addedReminder);
			// >> Return the item
			return addedReminder;
		},
		update: (localState, command) => {
			// >> Find the index of the resource object to update
			const reminderToUpdateIndex = localState.reminders.findIndex((reminder: Types.Reminder) => reminder.id === command.args.id);
			// >> If the item does not exist, throw an error
			if (reminderToUpdateIndex === -1) { throw new Error(`Reminder with id ${command.args.id} not found`) }
			// >> Find the index of the resource object to update
			const reminderToUpdate = localState.reminders[reminderToUpdateIndex]
			// >> Create a new resource object to update the local state
			const updatedReminder = Object.assign({}, reminderToUpdate, command.args);
			// >> Return the updated resource object
			return updatedReminder;
		},
		delete: (localState, command) => {
			// >> Find the index of the resource object to delete
			const reminderToDeleteIndex = localState.reminders.findIndex((reminder: Types.Reminder) => reminder.id === command.args.id);
			// >> If the resource object does not exist, throw an error
			if (reminderToDeleteIndex === -1) { throw new Error(`Reminder with id ${command.args.id} not found`) }
			// >> Find the resource object to delete
			const reminderToDelete = localState.reminders[reminderToDeleteIndex];
			// >> Delete the resource object from the local state
			localState.reminders.splice(reminderToDeleteIndex, 1);
			// >> Return undefined instead of the deleted resource object
			return undefined;
		},
	},
};
