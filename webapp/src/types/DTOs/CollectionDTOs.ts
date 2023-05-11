export interface CollectionDTO {
	collectionId: number;
	collectionName: string;
	isPrivate: boolean;
}

// ----- type guards -----
export function isCollectionDTO(obj: any): obj is CollectionDTO {
	return (
		obj &&
		obj.hasOwnProperty('collectionId') &&
		typeof obj.collectionId === 'number' &&
		obj.hasOwnProperty('collectionName') &&
		typeof obj.collectionName === 'string' &&
		obj.hasOwnProperty('isPrivate') &&
		typeof obj.isPrivate === 'boolean'
	);
}
