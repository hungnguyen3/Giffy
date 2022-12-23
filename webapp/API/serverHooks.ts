export async function getCollectionsByUserId(url = '') {
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'GET',
	});

	return response.json(); // parses JSON response into native JavaScript objects
}
