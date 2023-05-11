import { ResponseMessage } from '../types/ResponseMessage';
import { CollectionDTO } from '../types/DTOs/CollectionDTOs';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';
import { Auth } from 'aws-amplify';
import { store } from '../store';

class CollectionService {
	private static instance: CollectionService;

	private constructor() {}

	static getInstance(): CollectionService {
		if (!CollectionService.instance) {
			CollectionService.instance = new CollectionService();
		}
		return CollectionService.instance;
	}

	private async getAuthorizationHeader(): Promise<{ Authorization: string }> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		return {
			Authorization: `Bearer ${accessToken}`,
		};
	}

	async createCollection(data: {
		collectionName: string;
		isPrivate: boolean;
	}): Promise<ResponseMessage<CollectionDTO>> {
		try {
			const userId = store.getState().user.value?.userId;

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/createCollectionByUser/${userId}`,
				{
					method: 'POST',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						...(await this.getAuthorizationHeader()),
					},
					body: JSON.stringify(data),
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async deleteCollectionByCollectionId(collectionId: number): Promise<ResponseMessage<null>> {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/deleteCollectionById/${collectionId}`,
				{
					method: 'DELETE',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						...(await this.getAuthorizationHeader()),
					},
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async getCurrentUserCollections(): Promise<ResponseMessage<CollectionDTO[]>> {
		try {
			const userId = store.getState().user.value?.userId;

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/getCollectionsByUserId/${userId}`,
				{
					method: 'GET',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						...(await this.getAuthorizationHeader()),
					},
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async updateCollectionById(data: {
		collectionId: number;
		collectionName: string;
		isPrivate: boolean;
	}): Promise<ResponseMessage<CollectionDTO>> {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/updateCollectionById/${data.collectionId}`,
				{
					method: 'PUT',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						...(await this.getAuthorizationHeader()),
					},
					body: JSON.stringify({
						collectionName: data.collectionName,
						isPrivate: data.isPrivate,
					}),
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async getPublicCollections(limit?: number): Promise<ResponseMessage<CollectionDTO[]>> {
		try {
			const queryString = limit ? new URLSearchParams({ limit: limit.toString() }).toString() : '';
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collections/getPublicCollections?${queryString}`,
				{
					method: 'GET',
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}
}

export default CollectionService.getInstance();
