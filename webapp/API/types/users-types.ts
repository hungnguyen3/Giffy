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

export interface UpdateUserByIdDTO {
	data: UserDTO;
}

// ----- type guards -----
export function isUserDTO(obj: any): obj is UserDTO {
	return (
		obj &&
		obj.hasOwnProperty('userId') &&
		typeof obj.userId === 'number' &&
		obj.hasOwnProperty('userName') &&
		typeof obj.userName === 'string' &&
		obj.hasOwnProperty('profileImgUrl') &&
		typeof obj.profileImgUrl === 'string' &&
		obj.hasOwnProperty('firebaseAuthId') &&
		typeof obj.firebaseAuthId === 'string'
	);
}

export function isCreateUserDTO(obj: any): obj is CreateUserDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}

export function isGetUserByFirebaseAuthIdDTO(
	obj: any
): obj is GetUserByFirebaseAuthIdDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}

export function isUpdateUserByIdDTO(obj: any): obj is UpdateUserByIdDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}
