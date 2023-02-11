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

<<<<<<< HEAD
export interface AddUsersToCollectionsByUserIdDTO {
	data: UserDTO[];
=======
export interface UpdateUserByIdDTO {
	data: UserDTO;
>>>>>>> 8d1df5b399055cd834a478bd416345cda822c846
}
