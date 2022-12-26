import { giffyDTO } from './DTO';

export async function getCollectionsByUserId(userId: number) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/getCollectionsByUserId/${userId}`,
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
}

export async function createGiffy(data: {
	collectionId: number;
	firebaseUrl: string;
	giffyName: string;
}): Promise<giffyDTO> {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/createGiffy`,
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
}

export async function getUserByFirebaseAuthId(firebaseAuthId: string) {
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
}

export async function createCollection(data: {
	collectionName: string;
	private: boolean;
	userId: number;
}) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/createCollection`,
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
}

export async function getGiffiesByCollectionId(collectionId: number) {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/getGiffiesByCollectionId/${collectionId}`,
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
}
