export interface UserDTO {
	userId: number;
	userName: string;
	userUsername: string;
	userEmail: string;
	profileImgUrl: string;
}

export interface User extends UserDTO {
	cognitoSub: string;
}

export interface CreateUserDTO {
	status: string;
	message: string;
	data: UserDTO;
}

export interface GetUserByIdDTO {
	status: string;
	message: string;
	data: UserDTO;
}

export interface GetCurrentUserDTO {
	status: string;
	message: string;
	data: UserDTO;
}

export interface GetUserByUserEmailDTO {
	status: string;
	message: string;
	data: UserDTO;
}

export interface GetUserByUserUsernameDTO {
	status: string;
	message: string;
	data: UserDTO;
}

export interface UpdateUserByIdDTO {
	data: Partial<UserDTO>;
}

// ----- type guards -----
export function isUserDTO(obj: any): obj is UserDTO {
	return (
		obj &&
		obj.hasOwnProperty('userId') &&
		typeof obj.userId === 'number' &&
		obj.hasOwnProperty('userName') &&
		typeof obj.userName === 'string' &&
		obj.hasOwnProperty('userUsername') &&
		typeof obj.userUsername === 'string' &&
		obj.hasOwnProperty('userEmail') &&
		typeof obj.userEmail === 'string' &&
		obj.hasOwnProperty('cognitoSub') &&
		typeof obj.cognitoSub === 'string' &&
		obj.hasOwnProperty('profileImgUrl') &&
		typeof obj.profileImgUrl === 'string'
	);
}

export function isCreateUserDTO(obj: any): obj is CreateUserDTO {
	return (
		obj &&
		obj.hasOwnProperty('status') &&
		typeof obj.status === 'string' &&
		obj.hasOwnProperty('message') &&
		typeof obj.message === 'string' &&
		obj.hasOwnProperty('data') &&
		isUserDTO(obj.data)
	);
}

export function isGetUserByIdDTO(obj: any): obj is GetUserByIdDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}

export function isGetCurrentUserDTO(obj: any): obj is GetCurrentUserDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}

export function isGetUserByCognitoSubDTO(obj: any): obj is GetUserByUserEmailDTO {
	return obj && obj.hasOwnProperty('data') && isUserDTO(obj.data);
}

export function isUpdateUserByIdDTO(obj: any): obj is UpdateUserByIdDTO {
	return obj && obj.hasOwnProperty('data') && (isUserDTO(obj.data) || Object.keys(obj.data).length > 0);
}
