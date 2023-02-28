export interface UserDTO {
	userId: number;
	userName: string;
	userEmail: string;
	profileImgUrl: string;
}

export interface DeleteUserDTO {
	data: { successMessage: string };
}

export interface CreateUserDTO {
	data: UserDTO;
}

export interface GetUserByIdDTO {
	data: UserDTO;
}

export interface GetCurrentUserDTO {
	data: UserDTO;
}

export interface GetUserByEmailDTO {
	data: UserDTO;
}

export interface AddUsersToCollectionsByUserIdDTO {
	data: UserDTO[];
}

export interface UpdateUserByIdDTO {
	data: UserDTO;
}
