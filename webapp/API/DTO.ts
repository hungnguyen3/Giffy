export interface collectionDTO {
	collectionId: number;
	userId: number;
	permission: string;
	collectionName: string;
	private: boolean;
}

export interface giffyDTO {
	giffyId: number;
	collectionId: number;
	firebaseUrl: string;
	giffyName: string;
	likes: number;
}

export interface userDTO {
	userId: number;
	userName: string;
	profileImgUrl: string;
	firebaseAuthId: string;
}
