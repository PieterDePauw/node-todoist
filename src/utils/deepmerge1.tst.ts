import deepmerge from './deepmerge';

describe('deepmerge', () => {
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

	it('merges nested objects', () => {
		const obj1 = { a: { b: 1, c: 2 } };
		const obj2 = { a: { c: 3, d: 4 } };
		const expected = { a: { b: 1, c: 3, d: 4 } };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('merges arrays', () => {
		const obj1 = { a: [1, 2] };
		const obj2 = { a: [3, 4] };
		const expected = { a: [1, 2, 3, 4] };
		const actual = deepmerge(obj1, obj2);
		expect(actual).toEqual(expected);
	});

	it('throws an error for invalid input', () => {
		const obj1 = { a: 1 };
		const obj2 = 'not an object';
		expect(() => deepmerge(obj1, obj2)).toThrow();
	});
});