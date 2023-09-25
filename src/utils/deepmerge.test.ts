import deepmerge from './deepmerge';

describe('deepmerge', () => {

	// Basic merge with no conflicts
	it('merges two objects with no overlapping keys', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { c: 3, d: 4 };
		const expected = { a: 1, b: 2, c: 3, d: 4 };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	// Overlapping keys
	it('overrides properties from the first object with properties from the second when keys conflict', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { b: 3, c: 4 };
		const expected = { a: 1, b: 3, c: 4 };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	// Nested properties
	it('merges nested objects correctly', () => {
		const obj1 = { a: { b: 1, c: { d: 2 } } };
		const obj2 = { a: { b: 3, c: { e: 4 } }, f: 5 };
		const expected = {
			a: {
				b: 3,
				c: {
					d: 2,
					e: 4,
				},
			},
			f: 5,
		};
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	// Arrays
	it('overrides arrays from the first object with arrays from the second', () => {
		const obj1 = { a: [1, 2] };
		const obj2 = { a: [3, 4] };
		const expected = { a: [3, 4] };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
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
		const obj1 = {};
		const obj2 = { a: 1 };
		const result = deepmerge(obj1, obj2);
		expect(result).toEqual({ a: 1 });
	});

	// Invalid inputs
	it('throws an error for non-object inputs', () => {
		const obj1 = { a: 1 };
		const obj2 = 'not an object';
		expect(() => deepmerge(obj1, obj2)).toThrow();
		expect(() => deepmerge(null, obj1)).toThrowError();
		expect(() => deepmerge(obj1, undefined)).toThrowError();
		expect(() => deepmerge(obj1, 'invalid')).toThrowError();
	});
});
