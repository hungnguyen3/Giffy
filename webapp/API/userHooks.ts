import { ErrorDTO } from './types/errors-types';
import {
	CreateUserDTO,
	GetCurrentUserDTO,
	GetUserByIdDTO,
	UpdateUserByIdDTO,
} from './types/users-types';

export async function getUserById(
	userId: string
): Promise<GetUserByIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserById/${userId}`,
			{
				cache: 'no-cache',
				credentials: 'include',
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

export async function getCurrentUser(): Promise<GetCurrentUserDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getCurrentUser`,
			{
				cache: 'no-cache',
				credentials: 'include',
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
	profileImgUrl: string;
}): Promise<CreateUserDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/createUser`,
			{
				method: 'POST',
				cache: 'no-cache',
				credentials: 'include',
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
	profileImgUrl: string;
}): Promise<UpdateUserByIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/updateUserById/${data.userId}`,
			{
				method: 'PUT',
				cache: 'no-cache',
				credentials: 'include',
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
