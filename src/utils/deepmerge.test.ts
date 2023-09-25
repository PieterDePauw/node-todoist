import deepmerge from './deepmerge';

describe('deepmerge', () => {
	it('merges two objects with nested properties', () => {
		const object1 = {
			a: {
				b: 1,
				c: {
					d: 2,
				},
			},
		};
		const object2 = {
			a: {
				b: 3,
				c: {
					e: 4,
				},
			},
			f: 5,
		};
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
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
	});

	it('returns a new object and does not modify the original objects', () => {
		const object1 = {
			a: {
				b: 1,
			},
		};
		const object2 = {
			a: {
				c: 2,
			},
		};
		const expected = {
			a: {
				b: 1,
				c: 2,
			},
		};
		const actual = deepmerge(object1, object2);
		expect(actual).toEqual(expected);
		expect(actual).not.toBe(object1);
		expect(actual).not.toBe(object2);
	});

	it('throws an error if the input is invalid', () => {
		const object1 = {
			a: {
				b: 1,
			},
		};
		const object2 = {
			a: {
				c: 2,
			},
		};
		// @ts-ignore
		expect(() => deepmerge(null, object2)).toThrowError();
		// @ts-ignore
		expect(() => deepmerge(object1, undefined)).toThrowError();
		// @ts-ignore
		expect(() => deepmerge(object1, 'invalid')).toThrowError();
	});
});