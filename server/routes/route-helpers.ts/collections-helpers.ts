import { client } from '../../src/index';

export const createCollection = async (req: any, res: any) => {
	let collectionId = -1;
	let collection_userId = -1;
	try {
		if (!req.body.collectionName || !req.body.privacy || !req.body.userId)
			return res.status(400).send('missing required parameter(s)');

		const createCollectionRes = await client.query(
			`
        INSERT INTO collections ("collectionName", "privacy")
        VALUES ($1, $2)
        RETURNING *;
      `,
			[req.body.collectionName, req.body.privacy]
		);

		collectionId = createCollectionRes.rows[0].collectionId;

		if (createCollectionRes.rowCount !== 1) {
			return res.status(404).json({ error: "couldn't create a collection" });
		}

		const createCollectionsUsersRes = await client.query(
			`
        INSERT INTO collection_user_relationships ("collectionId", "userId", "permission")
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
			[collectionId, req.body.userId, 'admin']
		);

		collection_userId = createCollectionsUsersRes.rows[0].id;

		if (createCollectionsUsersRes.rowCount !== 1) {
			if (collection_userId == -1 && collectionId !== -1) {
				await client.query(
					`
              DELETE FROM collections WHERE "collectionId" = $1;
              `,
					[collectionId]
				);
			}
			return res.status(404).json({
				error: "couldn't create a relationship between collection & user",
			});
		}

		return res.status(200).json('successfully created a collection');
	} catch (e: any) {
		if (collection_userId == -1 && collectionId !== -1) {
			deleteCollectionUtil(collectionId, res);
		}
		res.status(404).json({ error: e });
	}
};

const deleteCollectionUtil = async (collectionId: number, res: any) => {
	try {
		if (!collectionId)
			return res.status(400).send('missing required parameter(s)');

		const deleteCollectionRes = await client.query(
			`
			  DELETE FROM collections WHERE "collectionId" = $1;
		  `,
			[collectionId]
		);

		if (deleteCollectionRes.rowCount <= 0)
			return res.status(404).send('There is no such collection');

		if (deleteCollectionRes.rowCount === 1)
			return res
				.status(200)
				.send(
					'you have successfully deleted a collection uid: ' + collectionId
				);

		if (deleteCollectionRes.rowCount > 1)
			return res
				.status(404)
				.send('error occurred, more than one collection with the same id');
	} catch (err) {
		return res.status(404).json({ error: err });
	}
};

export const deleteCollectionById = async (req: any, res: any) => {
	return deleteCollectionUtil(req.params.collectionId, res);
};

export const getCollectionById = async (req: any, res: any) => {
	try {
		if (!req.params.collectionId)
			return res.status(400).send('missing required parameter(s)');

		const getCollectionRes = await client.query(
			`
		    SELECT* FROM collections WHERE "collectionId" = $1;
		  `,
			[req.params.collectionId]
		);

		if (getCollectionRes.rowCount === 0)
			res.status(404).send('There is no such collection');

		if (getCollectionRes.rowCount === 1)
			res.status(200).send(getCollectionRes.rows[0]);

		if (getCollectionRes.rowCount > 1)
			res
				.status(404)
				.send('error occurred, more than one collection with the same id');
	} catch (err) {
		res.status(404).json({ error: err });
	}
};

export const updateCollectionById = async (req: any, res: any) => {
	try {
		if (
			!req.params.collectionId ||
			!req.body.collectionName ||
			!req.body.profileImgUrl ||
			!req.params.collectionId
		)
			return res.status(400).send('missing required parameter(s)');

		const updateCollectionRes = await client.query(
			`
        UPDATE collections
        SET "collectionName" = COALESCE($1, "collectionName"), "profileImgUrl"= COALESCE($2, "profileImgUrl")
        WHERE "collectionId" = $3;
      `,
			[req.body.collectionName, req.body.profileImgUrl, req.params.collectionId]
		);
		if (updateCollectionRes.rowCount === 0)
			res.status(404).send('There is no such collection');

		if (updateCollectionRes.rowCount === 1) {
			res
				.status(200)
				.send(
					'you have successfully update a collection uid: ' +
						req.params.collectionId
				);
		}

		if (updateCollectionRes.rowCount > 1) {
			res
				.status(404)
				.send('error occurred, more than one collection with the same id');
		}
	} catch (err) {
		res.status(404).json({ error: err });
	}
};
