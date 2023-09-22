// Validate a token to ensure it is a valid API key
export function validateToken(token: string): void {
	if (!(token.length === 40)) {
		throw new Error(`Invalid API token: a valid key has a total length of 40 characters`)
	}

	if (!/^[0-9A-Fa-f]{40}$/.test(token)) {
		throw new Error(`Invalid API token: a valid key consists of hexadecimals only`)
	}
}

export default validateToken;