// Helper function to check if a variable is an object
function isObject(item: any): boolean {
	return (item && item !== null && typeof item === 'object' && !Array.isArray(item));
}

// Helper function to deep merge objects
export function deepmerge(object1: any, object2: any): { [key: string]: any } {
	try {
		if (!isObject(object1) || !isObject(object2)) {
			throw new Error('Invalid input: both inputs must be objects');
		}

		const mergedObject = { ...object1 };

		for (const key in object2) {
			if (isObject(object2[key]) && isObject(mergedObject[key])) {
				mergedObject[key] = deepmerge(mergedObject[key], object2[key]);
			} else {
				mergedObject[key] = object2[key];
			}
		}

		return mergedObject;
	} catch (error) {
		throw new Error(`Deepmerge Error: ${error}`);
	}
}

export default deepmerge;
