import { store } from '../store';
import { Auth } from 'aws-amplify';
import { ResponseMessage } from '../types/ResponseMessage';
import { UserDTO } from '../types/DTOs/UserDTOs';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

class UserService {
	private static instance: UserService;

	constructor() {}

	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async getUserById(userId: string): Promise<ResponseMessage<UserDTO>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getAccessToken().getJwtToken();

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getUserById/${userId}`, {
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				method: 'GET',
			});

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async getCurrentUser(): Promise<ResponseMessage<UserDTO>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getCurrentUser`, {
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				method: 'GET',
			});

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async getUserByEmail(email: string): Promise<ResponseMessage<UserDTO>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/getUserByEmail/${email}`, {
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				method: 'GET',
			});

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async createUser(profileImgS3Url: string, profileImgS3Key: string): Promise<ResponseMessage<UserDTO>> {
		try {
			const session = await Auth.currentSession();
			const currentCognitoUser = await Auth.currentAuthenticatedUser();
			const accessToken = session.getIdToken().getJwtToken();
			const storeUserValue = store.getState().user.value;
			const data = {
				userName: storeUserValue?.userName,
				userEmail: storeUserValue?.userEmail,
				cognitoSub: currentCognitoUser.attributes.sub,
				profileImgS3Url: profileImgS3Url,
				profileImgS3Key: profileImgS3Key,
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/createUser`, {
				method: 'POST',
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			});

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async updateUser(data: {
		userId: number;
		userName: string;
		userEmail: string;
		profileImgS3Url: string;
		profileImgS3Key: string;
	}): Promise<ResponseMessage<UserDTO>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/updateUserById/${data.userId}`,
				{
					method: 'PUT',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}
}

export default UserService.getInstance();
