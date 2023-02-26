export interface CollectionUserRelationshipDTO {
	collectionId: number;
	userId: number;
	permission: 'read' | 'write' | 'admin';
}

export interface AddCollectionUserRelationshipDTO {
	data: CollectionUserRelationshipDTO;
}

export interface CollectionUserRelationshipsDTO
	extends AddCollectionUserRelationshipDTO {
	userName: string;
	userEmail: string;
	firebaseAuthId: string;
	profileImgUrl: string;
}

export interface GetUsersByCollectionIdDTO {
	data: CollectionUserRelationshipsDTO[];
}
