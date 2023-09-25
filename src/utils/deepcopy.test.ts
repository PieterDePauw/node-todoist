import deepcopy from './deepcopy';

describe('deepcopy', () => {
	it('returns a deep copy of an object', () => {
		const original = { a: 1, b: { c: 2 } };
		const copy = deepcopy(original);
		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
		expect(copy.b).not.toBe(original.b);
	});

	it('returns a deep copy of an array', () => {
		const original = [1, [2, 3]];
		const copy = deepcopy(original);
		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
		expect(copy[1]).not.toBe(original[1]);
	});

	it('returns a deep copy of a primitive value', () => {
		const original = 42;
		const copy = deepcopy(original);
		expect(copy).toEqual(original);
		expect(copy).toBe(original);
	});

	it('returns a deep copy of a null value', () => {
		const original = null;
		const copy = deepcopy(original);
		expect(copy).toEqual(original);
		expect(copy).toBe(original);
	});

	it('throws an error when the value is undefined', () => {
		const original = undefined;
		expect(() => deepcopy(original)).toThrow();
	});
});