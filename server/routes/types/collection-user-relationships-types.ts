export interface CollectionUserRelationshipDTO {
	collectionId: number;
	userId: number;
	permission: 'read' | 'write' | 'admin';
}

export interface AddCollectionUserRelationshipDTO {
	data: CollectionUserRelationshipDTO;
}
