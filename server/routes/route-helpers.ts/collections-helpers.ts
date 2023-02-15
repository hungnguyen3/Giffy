import { client, firebaseStorage } from '../../src/index';
import express from 'express';
import {
	CreateCollectionDTO,
	DeleteCollectionDTO,
	GetCollectionsByUserIdDTO,
	GetPublicCollectionsDTO,
	UpdateCollectionByIdDTO,
} from '../types/collections-types';
import { ErrorDTO } from '../types/errors-types';

export const createCollection = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (
			!(
				req.body.collectionName &&
				req.body.private !== undefined &&
				req.body.userId
			)
		)
			return res
				.status(400)
				.send({ error: 'missing required parameter(s)' } as ErrorDTO);

		await client.query('BEGIN');

		const createCollectionRes = await client.query(
			`INSERT INTO collections ("collectionName", "private") VALUES ($1, $2) RETURNING *;`,
			[req.body.collectionName, req.body.private]
		);

		if (createCollectionRes.rowCount !== 1) {
			await client.query('ROLLBACK');
			return res
				.status(500)
				.send({ error: "couldn't create a collection" } as ErrorDTO);
		}

		const collectionId = createCollectionRes.rows[0].collectionId;

		const createCollectionsUsersRes = await client.query(
			`INSERT INTO collection_user_relationships ("collectionId", "userId", "permission") VALUES ($1, $2, $3) RETURNING *;`,
			[collectionId, req.body.userId, 'admin']
		);

		if (createCollectionsUsersRes.rowCount !== 1) {
			await client.query('ROLLBACK');
			return res.status(500).send({
				error: "couldn't create a relationship between collection & user",
			} as ErrorDTO);
		}

		await client.query('COMMIT');
		return res
			.status(200)
			.send({ data: createCollectionRes.rows[0] } as CreateCollectionDTO);
	} catch (e) {
		await client.query('ROLLBACK');
		res.status(500).send({ error: e } as ErrorDTO);
	}
};

const deleteCollectionUtil = async (
	collectionId: number,
	res: express.Response
) => {
	try {
		if (!collectionId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			} as ErrorDTO);

		// Start a transaction
		await client.query('BEGIN');

		// Delete all giffies associated with this collection
		const giffiesToDelete = await client.query(
			`SELECT "firebaseRef" FROM giffies WHERE "collectionId" = $1`,
			[collectionId]
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
		await client.query(`DELETE FROM giffies WHERE "collectionId" = $1`, [
			collectionId,
		]);

		// Delete the collection
		const deleteCollectionRes = await client.query(
			`DELETE FROM collections WHERE "collectionId" = $1`,
			[collectionId]
		);

		// Commit the transaction
		await client.query('COMMIT');

		// Check if there are no rows affected
		if (deleteCollectionRes.rowCount <= 0)
			return res
				.status(500)
				.send({ error: 'There is no such collection' } as ErrorDTO);

		// Check if there are multiple rows affected
		if (deleteCollectionRes.rowCount > 1)
			return res.status(500).send({
				error: 'error occurred, more than one collection with the same id',
			} as ErrorDTO);

		// Return success message
		return res.status(200).send({
			data: {
				successMessage:
					'You have successfully deleted collection with id: ' + collectionId,
			},
		} as DeleteCollectionDTO);
	} catch (err) {
		// If error occurs, rollback the transaction
		await client.query('ROLLBACK');
		return res.status(500).send({ error: err } as ErrorDTO);
	}
};

export const deleteCollectionById = async (
	req: express.Request,
	res: express.Response
) => {
	return deleteCollectionUtil(Number(req.params.collectionId), res);
};

export const getCollectionById = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (!req.params.collectionId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const getCollectionRes = await client.query(
			`
		    SELECT* FROM collections WHERE "collectionId" = $1;
		  `,
			[req.params.collectionId]
		);

		if (getCollectionRes.rowCount === 0)
			res
				.status(500)
				.send({ error: 'There is no such collection' } as ErrorDTO);

		if (getCollectionRes.rowCount === 1)
			res.status(200).send(getCollectionRes.rows[0]);

		if (getCollectionRes.rowCount > 1)
			res.status(500).send({
				error: 'error occurred, more than one collection with the same id',
			} as ErrorDTO);
	} catch (err) {
		res.status(500).send({ error: err } as ErrorDTO);
	}
};

export const updateCollectionById = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (
			!req.params.collectionId ||
			!req.body.collectionName ||
			req.body.private === undefined ||
			req.body.private === null
		)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const updateCollectionRes = await client.query(
			`
        UPDATE collections
        SET "collectionName" = COALESCE($1, "collectionName"), "private"= COALESCE($2, "private")
        WHERE "collectionId" = $3
				RETURNING *;
      `,
			[req.body.collectionName, req.body.private, req.params.collectionId]
		);

		if (updateCollectionRes.rowCount === 0)
			res
				.status(404)
				.send({ error: 'There is no such collection' } as ErrorDTO);

		if (updateCollectionRes.rowCount === 1) {
			res.status(200).send({
				data: {
					collectionId: updateCollectionRes.rows[0].collectionId,
					collectionName: updateCollectionRes.rows[0].collectionName,
					private: updateCollectionRes.rows[0].private,
				},
			} as UpdateCollectionByIdDTO);
		}

		if (updateCollectionRes.rowCount > 1) {
			res.status(500).send({
				error: 'error occurred, more than one collection with the same id',
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ error: err } as ErrorDTO);
	}
};

export const getCollectionsByUserId = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const userId = parseInt(req.params.userId);

		if (isNaN(userId)) {
			return res.status(400).send({
				error: 'userId must be a valid integer',
			} as ErrorDTO);
		}

		let getCollectionsRes = await client.query(
			`
							SELECT collections.*
							FROM collection_user_relationships as cur
							INNER JOIN collections ON cur."collectionId" = collections."collectionId"
							WHERE cur."userId" = $1 AND ( cur.permission = 'admin'  OR cur.permission = 'write' );
					`,
			[userId]
		);

		res.status(200).send({
			data: getCollectionsRes.rows,
		} as GetCollectionsByUserIdDTO);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'something went wrong' } as ErrorDTO);
	}
};

export const getPublicCollections = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		const limit = parseInt(req.query.limit?.toString() || '10');
		if (isNaN(limit)) {
			return res.status(400).send({
				error: 'limit must be a valid integer',
			} as ErrorDTO);
		}

		let getCollectionsRes = await client.query(
			`
        SELECT *
        FROM collections
        WHERE "private" = false
        LIMIT $1;
      `,
			[limit]
		);

		res.status(200).send({
			data: getCollectionsRes.rows,
		} as GetPublicCollectionsDTO);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'something went wrong' } as ErrorDTO);
	}
};
