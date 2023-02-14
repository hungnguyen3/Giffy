export interface CollectionDTO {
	collectionId: number;
	collectionName: string;
	private: boolean;
}

export interface CreateCollectionDTO {
	data: CollectionDTO;
}

export interface DeleteCollectionDTO {
	data: { successMessage: string };
}

export interface GetCollectionsByUserIdDTO {
	data: CollectionDTO[];
}

export interface UpdateCollectionByIdDTO {
	data: CollectionDTO;
}

export interface GetPublicCollectionsDTO {
	data: CollectionDTO[];
}

// ----- type guards -----
export function isCollectionDTO(obj: any): obj is CollectionDTO {
	return (
		obj &&
		obj.hasOwnProperty('collectionId') &&
		typeof obj.collectionId === 'number' &&
		obj.hasOwnProperty('collectionName') &&
		typeof obj.collectionName === 'string' &&
		obj.hasOwnProperty('private') &&
		typeof obj.private === 'boolean'
	);
}

export function isCreateCollectionDTO(obj: any): obj is CreateCollectionDTO {
	return obj && obj.hasOwnProperty('data') && isCollectionDTO(obj.data);
}

export function isDeleteCollectionDTO(obj: any): obj is DeleteCollectionDTO {
	return (
		obj &&
		obj.hasOwnProperty('data') &&
		obj.data.hasOwnProperty('successMessage') &&
		typeof obj.data.successMessage === 'string'
	);
}

export function isGetCollectionsByUserIdDTO(
	obj: any
): obj is GetCollectionsByUserIdDTO {
	return (
		obj &&
		obj.hasOwnProperty('data') &&
		Array.isArray(obj.data) &&
		obj.data.every(isCollectionDTO)
	);
}

export function isUpdateCollectionByIdDTO(
	obj: any
): obj is UpdateCollectionByIdDTO {
	return obj && obj.hasOwnProperty('data') && isCollectionDTO(obj.data);
}

export function isGetPublicCollectionsDTO(
	obj: any
): obj is GetPublicCollectionsDTO {
	return (
		obj &&
		obj.hasOwnProperty('data') &&
		Array.isArray(obj.data) &&
		obj.data.every(isCollectionDTO)
	);
}
