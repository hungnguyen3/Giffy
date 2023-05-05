import { GiffyDTO } from '../types/DTOs/GiffyDTOs';
import { ResponseMessage } from '../types/ResponseMessage';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

export async function getGiffiesByCollectionId(collectionId: number): Promise<ResponseMessage<GiffyDTO[]>> {
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
		return RMFailedToMakeRequest;
	}
}

export async function createGiffy(data: {
	collectionId: number;
	firebaseUrl: string;
	firebaseRef: string;
	giffyName: string;
}): Promise<ResponseMessage<GiffyDTO>> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/createGiffy`, {
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

export async function deleteGiffiesByIds(data: { giffyIds: number[] }): Promise<ResponseMessage<null>> {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/deleteGiffiesByIds`, {
			method: 'DELETE',
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
