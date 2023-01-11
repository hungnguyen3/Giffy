export async function getCollectionsByUserId(userId: number) {
	try {
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
	} catch (e) {
		console.log(e);
	}
}

export async function deleteCollectionsByCollectionId(collectionId: number) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/collections/deleteCollectionById/${collectionId}`,
			{
				mode: 'cors',
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
	}
}

export async function getUserByFirebaseAuthId(firebaseAuthId: string) {
	try {
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
	} catch (e) {
		console.log(e);
	}
}

export async function getGiffiesByCollectionId(collectionId: number) {
	try {
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
	} catch (e) {
		console.log(e);
	}
}

export async function createUser(data: {
	userName: string;
	firebaseAuthId: string;
	profileImgUrl: string;
}) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/users/createUser`,
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
	} catch (err) {
		console.log(err);
	}
}

export async function createCollection(data: {
	collectionName: string;
	private: boolean;
	userId: number;
}) {
	try {
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
	} catch (e) {
		console.log(e);
	}
}

export async function createGiffy(data: {
	collectionId: number;
	firebaseUrl: string;
	firebaseRef: string;
	giffyName: string;
}) {
	try {
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
	} catch (err) {
		console.log(err);
	}
}

export async function deleteGiffyById(giffyId: number) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_SERVER_URL}/giffies/deleteGiffyById/${giffyId}`,
			{
				method: 'DELETE',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		return response.json();
	} catch (err) {
		console.log(err);
	}
}
