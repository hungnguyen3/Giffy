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
}) {
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

	return response;
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
