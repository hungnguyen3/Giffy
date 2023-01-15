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
