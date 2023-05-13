import { UserDTO } from '../types/DTOs/UserDTOs';
import { Permission } from '../types/enums/Permission';
import { ResponseMessage } from '../types/ResponseMessage';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';
import { Auth } from 'aws-amplify';

class CollectionUserRelationshipService {
	private static instance: CollectionUserRelationshipService;

	private constructor() {}

	static getInstance(): CollectionUserRelationshipService {
		if (!CollectionUserRelationshipService.instance) {
			CollectionUserRelationshipService.instance = new CollectionUserRelationshipService();
		}
		return CollectionUserRelationshipService.instance;
	}

	private async getAuthorizationHeader(): Promise<{ Authorization: string }> {
		const session = await Auth.currentSession();
		const accessToken = session.getIdToken().getJwtToken();
		return {
			Authorization: `Bearer ${accessToken}`,
		};
	}

	async getUsersByCollectionId(collectionId: number): Promise<ResponseMessage<UserDTO[]>> {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collectionUserRelationships/getUsersByCollectionId/${collectionId}`,
				{
					cache: 'no-cache',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						...(await this.getAuthorizationHeader()),
					},
					method: 'GET',
				}
			);

			return response.json();
		} catch (e) {
			return RMFailedToMakeRequest;
		}
	}

	async addUserToACollection(data: {
		collectionId: number;
		userId: number;
		permission: Permission;
	}): Promise<ResponseMessage<null>> {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/collectionUserRelationships/addCollectionUserRelationship`,
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
}

export default CollectionUserRelationshipService.getInstance();
