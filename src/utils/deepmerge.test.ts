import deepmerge from './deepmerge';

describe('deepmerge', () => {

	// Basic merge with no conflicts
	it('merges two objects with no overlapping keys', () => {
		const object1 = { a: 1, b: 2 };
		const object2 = { c: 3, d: 4 };
		const expected = { a: 1, b: 2, c: 3, d: 4 };
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
	});

	// Overlapping keys
	it('overrides properties from the first object with properties from the second when keys conflict', () => {
		const object1 = { a: 1, b: 2 };
		const object2 = { b: 3, c: 4 };
		const expected = { a: 1, b: 3, c: 4 };
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
	});

	// Nested properties
	it('merges nested objects correctly', () => {
		const object1 = { a: { b: 1, c: { d: 2 } } };
		const object2 = { a: { b: 3, c: { e: 4 } }, f: 5 };
		const expected = { a: { b: 3, c: { d: 2, e: 4 } }, f: 5 };
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
	});

	// Arrays
	it('merges arrays from the first object with arrays from the second', () => {
		const object1 = { a: [1, 2] };
		const object2 = { a: [3, 4] };
		const expected = { a: [1, 2, 3, 4] };
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
		expect(actual).not.toBe(object1);
		expect(actual).not.toBe(object2);
	});

	// Immutability
	it('returns a new object without modifying the original objects', () => {
		const object1 = { a: { b: 1 } };
		const object2 = { a: { c: 2 } };
		const expected = { a: { b: 1, c: 2 } };
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
		expect(actual).not.toBe(object1);
		expect(actual).not.toBe(object2);
	});

	// Empty objects
	it('handles merging with an empty object', () => {
		const object1 = {};
		const object2 = { a: 1 };
		const result = deepmerge(object1, object2);
		expect(result).toEqual(object2);
		expect(result).not.toBe(object1);
		expect(result).not.toBe(object2);
	});

	// Invalid inputs
	it('throws an error for non-object inputs', () => {
		const object1 = { a: 1 };
		const object2 = 'not an object';
		expect(() => deepmerge(object1, object2)).toThrow();
		expect(() => deepmerge(null, object1)).toThrowError();
		expect(() => deepmerge(object1, undefined)).toThrowError();
		expect(() => deepmerge(object1, 'invalid')).toThrowError();
	});
});
