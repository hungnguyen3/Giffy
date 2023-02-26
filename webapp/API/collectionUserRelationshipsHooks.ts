import { GetUsersByCollectionIdDTO } from './types/collection-user-relationships-types';
import { ErrorDTO } from './types/errors-types';

export async function getUsersByCollectionId(
	collectionId: number
): Promise<GetUsersByCollectionIdDTO | ErrorDTO> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collection-user-relationships/getUsersByCollectionId/${collectionId}`,
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
