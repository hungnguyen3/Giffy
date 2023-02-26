export interface UserDTO {
	userId: number;
	userName: string;
	userEmail: string;
	profileImgUrl: string;
	firebaseAuthId: string;
}

export interface CreateUserDTO {
	data: UserDTO;
}

export interface GetUserByFirebaseAuthIdDTO {
	data: UserDTO;
}

export interface AddUsersToCollectionsByUserIdDTO {
	data: UserDTO[];
}

export interface UpdateUserByIdDTO {
	data: UserDTO;
}
