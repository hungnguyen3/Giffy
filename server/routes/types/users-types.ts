export interface UserDTO {
	userId: number;
	userName: string;
	profileImgUrl: string;
	firebaseAuthId: string;
}

export interface CreateUserDTO {
	data: UserDTO;
}

export interface GetUserByFirebaseAuthIdDTO {
	data: UserDTO;
}
