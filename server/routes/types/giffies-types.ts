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
