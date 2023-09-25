import { validateToken } from './validatetoken';

describe('validateToken', () => {
	it('does not throw an error for a valid token', () => {
		const token = '0123456789abcdef0123456789abcdef01234567';
		expect(() => validateToken(token)).not.toThrow();
	});

	it('throws an error for a token that is too short', () => {
		const token = '0123456789abcdef0123456789abcde';
		expect(() => validateToken(token)).toThrowError('Invalid API token: a valid key has a total length of 40 characters');
	});

	it('throws an error for a token that is too long', () => {
		const token = '0123456789abcdef0123456789abcdef012345678';
		expect(() => validateToken(token)).toThrowError('Invalid API token: a valid key has a total length of 40 characters');
	});

	it('throws an error for a token that contains non-hexadecimal characters', () => {
		const token = '0123456789abcdef0123456789abcdef0123454g';
		expect(() => validateToken(token)).toThrowError('Invalid API token: a valid key consists of hexadecimals only');
	});
});