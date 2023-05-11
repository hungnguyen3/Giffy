import { Auth } from 'aws-amplify';
import { GiffyDTO } from '../types/DTOs/GiffyDTOs';
import { ResponseMessage } from '../types/ResponseMessage';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

class GiffyService {
	private static instance: GiffyService;

	constructor() {}

	static getInstance(): GiffyService {
		if (!GiffyService.instance) {
			GiffyService.instance = new GiffyService();
		}
		return GiffyService.instance;
	}

	async getGiffiesByCollectionId(collectionId: number): Promise<ResponseMessage<GiffyDTO[]>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/giffies/getGiffiesByCollectionId/${collectionId}`,
				{
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					method: 'GET',
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async createGiffy(data: {
		collectionId: number;
		giffyS3Url: string;
		giffyS3Key: string;
		giffyName: string;
	}): Promise<ResponseMessage<GiffyDTO>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/giffies/createGiffy`, {
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

	async deleteGiffiesByIds(data: { giffyIds: number[] }): Promise<ResponseMessage<null>> {
		try {
			const session = await Auth.currentSession();
			const accessToken = session.getIdToken().getJwtToken();

			const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/giffies/deleteGiffiesByIds`, {
				method: 'DELETE',
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
}

export default GiffyService.getInstance();
