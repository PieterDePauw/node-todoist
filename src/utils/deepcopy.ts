
// Create a function to deep copy to the commands array
export function deepcopy(input: any) {
	try {
		return JSON.parse(JSON.stringify(input));
	}
	catch {
		throw new Error(`Invalid input: ${input}`);
	}
}

export default deepcopy;