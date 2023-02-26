import { ErrorDTO } from './types/errors-types';
import {
	CreateUserDTO,
	GetUserByEmailDTO,
	GetUserByFirebaseAuthIdDTO,
	UpdateUserByIdDTO,
} from './types/users-types';

export async function getUserByFirebaseAuthId(
	firebaseAuthId: string
): Promise<GetUserByFirebaseAuthIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByFirebaseAuthId/${firebaseAuthId}`,
			{
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			}
		);

		return response.json();
	} catch (e) {
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function getUserByEmail(
	email: string
): Promise<GetUserByEmailDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByEmail/${email}`,
			{
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			}
		);

		return response.json();
	} catch (e) {
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function createUser(data: {
	userName: string;
	userEmail: string;
	firebaseAuthId: string;
	profileImgUrl: string;
}): Promise<CreateUserDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/createUser`,
			{
				method: 'POST',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		);

		return response.json();
	} catch (e) {
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function updateUser(data: {
	userId: number;
	userName: string;
	userEmail: string;
	profileImgUrl: string;
}): Promise<UpdateUserByIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/updateUserById/${data.userId}`,
			{
				method: 'PUT',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}
		);

		return response.json();
	} catch (e) {
		return { error: 'unknown error' } as ErrorDTO;
	}
}
