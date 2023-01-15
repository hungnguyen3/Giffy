import { ErrorDTO } from './types/errors-types';
import { CreateUserDTO, GetUserByFirebaseAuthIdDTO } from './types/users-types';

export async function getUserByFirebaseAuthId(
	firebaseAuthId: string
): Promise<GetUserByFirebaseAuthIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getUserByFirebaseAuthId/${firebaseAuthId}`,
			{
				mode: 'cors',
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
	firebaseAuthId: string;
	profileImgUrl: string;
}): Promise<CreateUserDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/createUser`,
			{
				method: 'POST',
				mode: 'cors',
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
