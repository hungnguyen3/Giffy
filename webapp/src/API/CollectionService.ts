import { ResponseMessage } from '../types/ResponseMessage';
import { CollectionDTO } from '../types/DTOs/CollectionDTOs';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

export async function createCollection({
	data,
}: {
	data: {
		collectionName: string;
		private: boolean;
		userId: number;
	};
}): Promise<ResponseMessage<CollectionDTO>> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/createCollection`, {
			method: 'POST',
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		return response.json();
	} catch (e) {
		return RMFailedToMakeRequest;
	}
}

export async function deleteCollectionByCollectionId(collectionId: number): Promise<ResponseMessage<null>> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/deleteCollectionById/${collectionId}`,
			{
				cache: 'no-cache',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			}
		);

		return response.json();
	} catch (e) {
		return RMFailedToMakeRequest;
	}
}

export async function getCurrentUserCollections(): Promise<ResponseMessage<CollectionDTO[]>> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/getCurrentUserCollections`, {
			cache: 'no-cache',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		});

		return response.json();
	} catch (e) {
		return RMFailedToMakeRequest;
	}
}

export async function updateCollectionById(data: {
	collectionId: number;
	collectionName: string;
	private: boolean;
}): Promise<ResponseMessage<CollectionDTO>> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/updateCollectionById/${data.collectionId}`,
			{
				cache: 'no-cache',
				credentials: 'include',
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
		return RMFailedToMakeRequest;
	}
}

export async function getPublicCollections(limit?: number): Promise<ResponseMessage<CollectionDTO[]>> {
	try {
		const queryString = limit ? new URLSearchParams({ limit: limit.toString() }).toString() : '';
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/getPublicCollections?${queryString}`,
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
		return RMFailedToMakeRequest;
	}
}
