import deepmerge from './deepmerge';

describe('deepmerge', () => {
	it('should merge two objects', () => {
		const obj1 = { a: 1, b: { c: 2 } };
		const obj2 = { b: { d: 3 }, e: 4 };
		const result = deepmerge(obj1, obj2);
		expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
	});

	it('merges two objects with no conflicts', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { c: 3, d: 4 };
		const expected = { a: 1, b: 2, c: 3, d: 4 };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('merges two objects with conflicting keys', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { b: 3, c: 4 };
		const expected = { a: 1, b: 3, c: 4 };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('merges two objects with nested objects', () => {
		const obj1 = { a: { b: 1, c: 2 } };
		const obj2 = { a: { c: 3, d: 4 } };
		const expected = { a: { b: 1, c: 3, d: 4 } };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('merges two objects with nested arrays', () => {
		const obj1 = { a: [1, 2, 3] };
		const obj2 = { a: [4, 5, 6] };
		const expected = { a: [1, 2, 3, 4, 5, 6] };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('merges two objects with nested arrays and objects', () => {
		const obj1 = { a: { b: [1, 2], c: { d: 3 } } };
		const obj2 = { a: { b: [4, 5], c: { e: 6 } } };
		const expected = { a: { b: [1, 2, 4, 5], c: { d: 3, e: 6 } } };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('should handle empty objects', () => {
		const obj1 = {};
		const obj2 = { a: 1 };
		const result = deepmerge(obj1, obj2);
		expect(result).toEqual({ a: 1 });
	});

	it('should handle non-object inputs', () => {
		const obj1 = { a: 1 };
		const obj2 = 'not an object';
		expect(() => deepmerge(obj1, obj2)).toThrow();
	});
});