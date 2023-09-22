
// Create a function to deep copy to the commands array
export function deepcopy(input: any) {
	return JSON.parse(JSON.stringify(input));
}

export default deepcopy;