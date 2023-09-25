import capitalizeFirstLetter from './capitalizefirstletter';

describe('capitalizeFirstLetter', () => {
	it('capitalizes the first letter of a string', () => {
		const input = 'hello world';
		const expectedOutput = 'Hello world';
		const actualOutput = capitalizeFirstLetter(input);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it('does not modify a string that is already capitalized', () => {
		const input = 'Hello world';
		const expectedOutput = 'Hello world';
		const actualOutput = capitalizeFirstLetter(input);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it('capitalizes the first letter of a one-letter string', () => {
		const input = 'a';
		const expectedOutput = 'A';
		const actualOutput = capitalizeFirstLetter(input);
		expect(actualOutput).toEqual(expectedOutput);
	});

	it('returns an empty string when given an empty string', () => {
		const input = '';
		const expectedOutput = '';
		const actualOutput = capitalizeFirstLetter(input);
		expect(actualOutput).toEqual(expectedOutput);
	});
});