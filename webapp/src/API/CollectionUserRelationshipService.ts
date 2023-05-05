import { UserDTO } from '../types/DTOs/UserDTOs';
import { ResponseMessage } from '../types/ResponseMessage';
import { RMFailedToMakeRequest } from '../types/ResponseMessageConst';

export async function getUsersByCollectionId(collectionId: number): Promise<ResponseMessage<UserDTO[]>> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collection-user-relationships/getUsersByCollectionId/${collectionId}`,
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

export async function addUserToACollection(data: {
	collectionId: number;
	userId: number;
	permission: 'read' | 'write' | 'admin';
}): Promise<ResponseMessage<null>> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collection-user-relationships/addCollectionUserRelationship`,
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
		return RMFailedToMakeRequest;
	}
}
