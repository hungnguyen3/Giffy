import { ErrorDTO } from './types/errors-types';
import {
	GetGiffiesByCollectionIdDTO,
	CreateGiffyDTO,
	DeleteGiffiesDTO,
} from './types/giffies-types';

export async function getGiffiesByCollectionId(
	collectionId: number
): Promise<GetGiffiesByCollectionIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/getGiffiesByCollectionId/${collectionId}`,
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

export async function createGiffy(data: {
	collectionId: number;
	firebaseUrl: string;
	firebaseRef: string;
	giffyName: string;
}): Promise<CreateGiffyDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/createGiffy`,
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

export async function deleteGiffiesByIds(data: {
	giffyIds: number[];
}): Promise<DeleteGiffiesDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/deleteGiffiesByIds`,
			{
				method: 'DELETE',
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
