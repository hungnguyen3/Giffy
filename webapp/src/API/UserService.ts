import { ErrorDTO } from './types/errors-types';
import {
	CreateUserDTO,
	GetUserByUserEmailDTO,
	GetCurrentUserDTO,
	GetUserByIdDTO,
	UpdateUserByIdDTO,
} from './types/users-types';
import { store } from '../store';
import { Auth } from 'aws-amplify';
import { RootState } from '../store';

class UserService {
	private static instance: UserService;

	constructor() {}

	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	async getUserById(userId: string): Promise<GetUserByIdDTO | ErrorDTO> {
		const session = await Auth.currentSession();
		const accessToken = session.getAccessToken().getJwtToken();

		console.log(session.isValid());
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserById/${userId}`, {
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
			return { error: 'unknown error' } as ErrorDTO;
		}
	}

	async getCurrentUser(): Promise<GetCurrentUserDTO | ErrorDTO> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		console.log(session.isValid());
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getCurrentUser`, {
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
			return { error: 'unknown error' } as ErrorDTO;
		}
	}

	async getUserByEmail(email: string): Promise<GetUserByUserEmailDTO | ErrorDTO> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByEmail/${email}`, {
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
			return { error: 'unknown error' } as ErrorDTO;
		}
	}

	async createUser(): Promise<CreateUserDTO | ErrorDTO> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		const storeUserValue = store.getState().user.value;
		const data = {
			userName: storeUserValue?.userName,
			userUsernam: storeUserValue?.userUsername,
			userEmail: storeUserValue?.userEmail,
			profileImgUrl: storeUserValue?.profileImgUrl,
		};

		try {
			console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/createUser`);
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
			return { error: 'unknown error' } as ErrorDTO;
		}
	}

	async updateUser(data: {
		userId: number;
		userName: string;
		userEmail: string;
		profileImgUrl: string;
	}): Promise<UpdateUserByIdDTO | ErrorDTO> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/updateUserById/${data.userId}`, {
				method: 'PUT',
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
			return { error: 'unknown error' } as ErrorDTO;
		}
	}
}

export default UserService.getInstance();
