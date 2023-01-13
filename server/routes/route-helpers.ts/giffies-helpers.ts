import { client, firebaseStorage } from '../../src/index';

export const createGiffy = async (req: any, res: any) => {
	try {
		if (
			!(
				req.body.collectionId &&
				req.body.firebaseUrl &&
				req.body.firebaseRef &&
				req.body.giffyName !== undefined &&
				req.body.giffyName !== null
			)
		)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const createGiffy = await client.query(
			`
      INSERT INTO giffies ("collectionId", "firebaseUrl", "firebaseRef", "giffyName", "likes")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
			[
				req.body.collectionId,
				req.body.firebaseUrl,
				req.body.firebaseRef,
				req.body.giffyName,
				0,
			]
		);

		if (createGiffy.rowCount === 1) {
			return res.status(200).send(createGiffy.rows[0]);
		}

		return res.status(500).json({ error: 'db error' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: err });
	}
};

const deleteGiffies = async (giffyIds: number[], res: any) => {
	try {
		if (!giffyIds || !giffyIds.length) {
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});
		}

		// Start a transaction
		await client.query('BEGIN');

		// Select all giffies with the provided ids
		const giffiesToDelete = await client.query(
			`SELECT "firebaseRef" FROM giffies WHERE "giffyId" = ANY($1)`,
			[giffyIds]
		);

		// Delete giffy images from firebase storage
		const imageDeletionPromises = giffiesToDelete.rows.map(
			async (giffy: any) => {
				const ref = firebaseStorage
					.bucket(process.env.FIREBASE_STORAGE_PATH)
					.file(giffy.firebaseRef);
				return ref.delete();
			}
		);

		await Promise.all(imageDeletionPromises);

		// Delete giffies from database
		await client.query(`DELETE FROM giffies WHERE "giffyId" = ANY($1)`, [
			giffyIds,
		]);

		// Commit the transaction
		await client.query('COMMIT');

		// Return success message
		return res.status(200).send({ message: 'Giffies successfully deleted' });
	} catch (e) {
		// An error occurred, rollback the transaction
		await client.query('ROLLBACK');
		console.error(e);
		return res
			.status(500)
			.send({ error: 'An error occurred while deleting the giffies' });
	}
};

export const deleteGiffiesByIds = async (req: any, res: any) => {
	return deleteGiffies(req.body.giffyIds, res);
};

export const getGiffyById = async (req: any, res: any) => {
	try {
		if (!req.params.giffyId) {
			console.log(req.params);
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});
		}

		const getGiffyRes = await client.query(
			`
		    SELECT* FROM giffies WHERE "giffyId" = $1;
		  `,
			[req.params.giffyId]
		);

		if (getGiffyRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such giffy' });

		if (getGiffyRes.rowCount === 1)
			return res.status(200).send(getGiffyRes.rows[0]);

		if (getGiffyRes.rowCount > 1)
			return res
				.status(500)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

export const getGiffiesByCollectionId = async (req: any, res: any) => {
	try {
		if (!req.params.collectionId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const getGiffiesRes = await client.query(
			`
		    SELECT* FROM giffies WHERE "collectionId" = $1;
		  `,
			[req.params.collectionId]
		);

		if (getGiffiesRes.rowCount <= 0) return res.status(500).send([]);

		if (getGiffiesRes.rowCount >= 1)
			return res.status(200).send(getGiffiesRes.rows);
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

export const updateGiffyById = async (req: any, res: any) => {
	try {
		if (!req.params.giffyId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const updateGiffyRes = await client.query(
			`
        UPDATE giffies
        SET 
				"collectionId" = COALESCE($1, "collectionId"), "firebaseUrl"= COALESCE($2, "firebaseUrl"),
				"firebaseRef" = COALESCE($3, "firebaseRef"),
				"giffyName" = COALESCE($4, "giffyName"), "likes" = COALESCE($5, "likes")
        WHERE "giffyId" = $5;
      `,
			[
				req.body.collectionId,
				req.body.firebaseUrl,
				req.body.firebaseRef,
				req.body.giffyName,
				req.body.likes,
				req.params.giffyId,
			]
		);
		if (updateGiffyRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such giffy' });

		if (updateGiffyRes.rowCount === 1)
			return res
				.status(200)
				.send(
					'you have successfully update a giffy uid: ' + req.params.giffyId
				);

		if (updateGiffyRes.rowCount > 1)
			return res
				.status(500)
				.send('error occurred, more than one giffy with the same id');
	} catch (err) {
		return res.status(500).json({ error: err });
	}
};

export const getGiffyCloudUrlById = (req: any, res: any) => {
	if (!req.params.giffyId) {
		return res.status(400).send({
			error: 'missing required parameter(s)',
		});
	}
};
