import {
	CreateCollectionDTO,
	DeleteCollectionDTO,
	GetCollectionsByUserIdDTO,
	GetPublicCollectionsDTO,
	UpdateCollectionByIdDTO,
} from './types/collections-types';
import { ErrorDTO } from './types/errors-types';

export async function createCollection(data: {
	collectionName: string;
	private: boolean;
	userId: number;
}): Promise<CreateCollectionDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/createCollection`,
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
		console.log(e);
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function deleteCollectionsByCollectionId(
	collectionId: number
): Promise<DeleteCollectionDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/deleteCollectionById/${collectionId}`,
			{
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			}
		);

		return response.json();
	} catch (e) {
		console.log(e);
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function getCollectionsByUserId(
	userId: number
): Promise<GetCollectionsByUserIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/getCollectionsByUserId/${userId}`,
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
		console.log(e);
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function updateCollectionById(data: {
	collectionId: number;
	collectionName: string;
	private: boolean;
}): Promise<UpdateCollectionByIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/updateCollectionById/${data.collectionId}`,
			{
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'PUT',
				body: JSON.stringify({
					collectionName: data.collectionName,
					private: data.private,
				}),
			}
		);

		return response.json();
	} catch (e) {
		console.log(e);
		return { error: 'unknown error' } as ErrorDTO;
	}
}

export async function getPublicCollections(
	limit?: number
): Promise<GetPublicCollectionsDTO | ErrorDTO> {
	try {
		const queryString = limit
			? new URLSearchParams({ limit: limit.toString() }).toString()
			: '';
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/getPublicCollections?${queryString}`,
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
		console.log(e);
		return { error: 'unknown error' } as ErrorDTO;
	}
}
