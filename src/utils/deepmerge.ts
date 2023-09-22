
// Create a function to deep merge an object, like the state object
export function deepmerge(object1: any, object2: any) {
	return Object.assign({}, object1, object2);
}

export default deepmerge;