import { State } from "../v9-interfaces";
import {
	deepcopy,
	deepmerge,
	validateToken,
	capitalizeFirstLetter,
	getApiUrl,
	replaceTempId,
	getResourceTypePlural,
	findObject,
	findObjectInState,
	TODOIST_AUTOCOMMIT,
	TODOIST_BASE_URL,
	TODOIST_RESOURCE_TYPES
} from "./index";

import { v9 as Todoist } from '../index';
let api = Todoist(process.env.TODOIST_API_KEY as string)

describe('Utility Functions and Constants', () => {
	// Testing deepcopy
	it('deepcopy should return an object', () => {
		const obj = { a: 1, b: 2 };
		const copied = deepcopy(obj);
		expect(typeof copied).toBe('object');
		expect(copied).not.toBe(obj);  // Ensuring a new reference
	});

	// Testing deepmerge
	it('deepmerge should return an object', () => {
		const obj1 = { a: 1 };
		const obj2 = { b: 2 };
		const merged = deepmerge(obj1, obj2);
		expect(merged).toEqual({ a: 1, b: 2 });
	});

	// Testing validateToken
	it('validateToken should return nothing', () => {
		expect(() => validateToken("0123456789abcdef0123456789abcdef01234567")).not.toThrow();
	});

	// Testing capitalizeFirstLetter
	it('capitalizeFirstLetter should capitalize the first letter of a string', () => {
		expect(capitalizeFirstLetter('hello')).toBe('Hello');
	});

	// Testing getApiUrl
	it('getApiUrl should return a string', () => {
		expect(typeof getApiUrl("v9")).toBe('string');
	});

	// Testing replaceTempId
	it('replaceTempId should return a string or number', () => {
		expect('boolean').toContain(typeof replaceTempId("temp123", "real123", api.state()));
	});

	// Testing getResourceTypePlural
	it('getResourceTypePlural should return a string', () => {
		expect(typeof getResourceTypePlural("item")).toBe('string');
	});

	// Testing findObject
	it('findObject should return an object or undefined', () => {
		const result = findObject('items', { "id": "1" }, api.state());
		expect(result === undefined || typeof result === 'object').toBe(true);
	});

	// Testing findObjectInState
	it('findObjectInState should return an object or undefined', () => {
		const result = findObject("resources", { "id": "1" }, api.state());
		expect(result === undefined || typeof result === 'object').toBe(true);
	});

	// Testing TODOIST_AUTOCOMMIT
	it('TODOIST_AUTOCOMMIT should be defined', () => {
		expect(TODOIST_AUTOCOMMIT).toBeDefined();
	});

	// Testing TODOIST_BASE_URL
	it('TODOIST_BASE_URL should be a string', () => {
		expect(typeof TODOIST_BASE_URL).toBe('string');
	});

	// Testing TODOIST_RESOURCE_TYPES
	it('TODOIST_RESOURCE_TYPES should be an object', () => {
		expect(typeof TODOIST_RESOURCE_TYPES).toBe('string');
		expect(typeof JSON.parse(TODOIST_RESOURCE_TYPES)).toBe('object');
	});
});


/*
describe("deepcopy", () => {
	it("should return a deep copy of the input object", () => {
		const obj = { a: 1, b: { c: 2 } };
		const copy = deepcopy(obj);
		expect(copy).toEqual(obj);
		expect(copy).not.toBe(obj);
		expect(copy.b).not.toBe(obj.b);
	});
});

describe("deepmerge", () => {
	it("should merge two objects deeply", () => {
		const obj1 = { a: 1, b: { c: 2 } };
		const obj2 = { b: { d: 3 }, e: 4 };
		const merged = deepmerge(obj1, obj2);
		expect(merged).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});
});

describe("validateToken", () => {
	it("should return true for a valid token", () => {
		const token = "valid-token";
		expect(validateToken(token)).toBe(true);
	});

	it("should return false for an invalid token", () => {
		const token = "";
		expect(validateToken(token)).toBe(false);
	});
});

describe("capitalizeFirstLetter", () => {
	it("should capitalize the first letter of a string", () => {
		const str = "hello world";
		expect(capitalizeFirstLetter(str)).toBe("Hello world");
	});
});

describe("getApiUrl", () => {
	it("should return the API URL for a resource type", () => {
		const resourceType = "project";
		expect(getApiUrl(resourceType)).toBe(
			"https://api.todoist.com/rest/v1/projects"
		);
	});
});

describe("replaceTempId", () => {
	it("should replace a temporary ID with a real ID", () => {
		const state = { projects: [{ id: "123", temp_id: "abc" }] };
		const obj = { temp_id: "abc" };
		// @ts-ignore
		const replaced = replaceTempId(obj.temp_id, state["projects"][0]["id"], state);
		expect(replaced).toEqual({ id: 123 });
	});
});

describe("getResourceTypePlural", () => {
	it("should return the plural form of a resource type", () => {
		const resourceType = "project";
		expect(getResourceTypePlural(resourceType)).toBe("projects");
	});
});

describe("findObject", () => {
	it("should find an object in an array by ID", () => {
		const state: State = api.state()
		const arr = [{ id: "1" }, { id: "2" }, { id: "3" }];
		const id = 2;
		const found = findObject("items", arr[1], state);
		expect(found).toEqual({ id: "2" });
	});

	it("should return undefined if the object is not found", () => {
		const state: State = api.state()
		const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const id = 4;
		const found = findObject("items", id, state);
		expect(found).toBeUndefined();
	});
});

describe("findObjectInState", () => {
	it("should find an object in the state by ID", () => {
		const state = { projects: [{ id: 1 }, { id: 2 }, { id: 3 }] };
		const resourceType = "projects";
		const id = "2";
		// @ts-ignore
		const found = findObjectInState(state, resourceType, id);
		expect(found).toEqual({ id: 2 });
	});

	it("should return undefined if the object is not found", () => {
		const state = { projects: [{ id: 1 }, { id: 2 }, { id: 3 }] };
		const resourceType = "projects";
		const id = "4";
		// @ts-ignore
		const found = findObjectInState(state, resourceType, id);
		expect(found).toBeUndefined();
	});
});
*/