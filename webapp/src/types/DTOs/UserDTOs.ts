export interface UserDTO {
	userId: number;
	userName: string;
	userEmail: string;
	profileImgS3Url: string;
	profileImgS3Key: string;
}

export interface User extends UserDTO {
	cognitoSub: string;
}

// ----- type guards -----
export function isUserDTO(obj: any): obj is UserDTO {
	return (
		obj &&
		obj.hasOwnProperty('userId') &&
		typeof obj.userId === 'number' &&
		obj.hasOwnProperty('userName') &&
		typeof obj.userName === 'string' &&
		obj.hasOwnProperty('userEmail') &&
		typeof obj.userEmail === 'string' &&
		obj.hasOwnProperty('cognitoSub') &&
		typeof obj.cognitoSub === 'string' &&
		obj.hasOwnProperty('profileImgS3Url') &&
		typeof obj.profileImgS3Url === 'string' &&
		obj.hasOwnProperty('profileImgS3Key') &&
		typeof obj.profileImgS3Key === 'string'
	);
}
