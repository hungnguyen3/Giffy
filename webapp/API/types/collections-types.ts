export interface collectionDTO {
	collectionId: number;
	userId: number;
	permission: string;
	collectionName: string;
	private: boolean;
}

export interface GetCollectionsByUserIdDTO {
	data: collectionDTO[];
}

// ----- type guards -----
export function isGetCollectionsByUserIdDTO(
	obj: any
): obj is GetCollectionsByUserIdDTO {
	return obj && obj.hasOwnProperty('data') && Array.isArray(obj.data);
}
