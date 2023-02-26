export type CollectionUserRelationshipsDTO = {
	userId: number;
	userName: string;
	userEmail: string;
	firebaseAuthId: string;
	profileImgUrl: string;
	collectionId: number;
	permission: 'read' | 'write' | 'admin';
};

export type GetUsersByCollectionIdDTO = CollectionUserRelationshipsDTO[];
