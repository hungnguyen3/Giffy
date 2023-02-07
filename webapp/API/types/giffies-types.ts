export interface GiffyDTO {
	giffyId: number;
	collectionId: number;
	firebaseUrl: string;
	firebaseRef: string;
	giffyName: string;
	likes: number;
}

export interface GetGiffiesByCollectionIdDTO {
	data: GiffyDTO[];
}
export interface DeleteGiffiesDTO {
	data: { successMessage: string };
}

export interface CreateGiffyDTO {
	data: GiffyDTO;
}

// ----- type guards -----
export function isGiffyDTO(obj: any): obj is GiffyDTO {
	return (
		obj &&
		obj.hasOwnProperty('giffyId') &&
		typeof obj.giffyId === 'number' &&
		obj.hasOwnProperty('collectionId') &&
		typeof obj.collectionId === 'number' &&
		obj.hasOwnProperty('firebaseUrl') &&
		typeof obj.firebaseUrl === 'string' &&
		obj.hasOwnProperty('firebaseRef') &&
		typeof obj.firebaseRef === 'string' &&
		obj.hasOwnProperty('giffyName') &&
		typeof obj.giffyName === 'string' &&
		obj.hasOwnProperty('likes') &&
		typeof obj.likes === 'number'
	);
}

export function isGetGiffiesByCollectionIdDTO(
	obj: any
): obj is GetGiffiesByCollectionIdDTO {
	return (
		obj &&
		obj.hasOwnProperty('data') &&
		Array.isArray(obj.data) &&
		obj.data.every(isGiffyDTO)
	);
}

export function isDeleteGiffiesDTO(obj: any): obj is DeleteGiffiesDTO {
	return (
		obj &&
		obj.hasOwnProperty('data') &&
		obj.data.hasOwnProperty('successMessage') &&
		typeof obj.data.successMessage === 'string'
	);
}

export function isCreateGiffyDTO(obj: any): obj is CreateGiffyDTO {
	return obj && obj.hasOwnProperty('data') && isGiffyDTO(obj.data);
}
