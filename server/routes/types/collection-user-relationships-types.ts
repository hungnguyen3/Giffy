export interface CollectionUserRelationshipDTO {
	collectionId: number;
	userId: number;
	permission: string;
}

export interface AddCollectionUserRelationshipDTO {
	data: CollectionUserRelationshipDTO;
}
