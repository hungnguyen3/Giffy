import { client } from '../../src/index';
import express from 'express';
import { ErrorDTO } from '../types/errors-types';
import { AddCollectionUserRelationshipDTO } from '../types/collection-user-relationships-types';

export const addCollectionUserRelationship = async (
	req: express.Request,
	res: express.Response
) => {
	try {
		if (
			!(
				req.body.collectionId &&
				req.body.userId &&
				req.body.permission !== undefined
			)
		)
			return res
				.status(400)
				.send({ error: 'missing required parameter(s)' } as ErrorDTO);

		const collectionId = parseInt(req.body.collectionId);
		const userId = parseInt(req.body.userId);

		if (isNaN(collectionId) || isNaN(userId)) {
			return res.status(400).send({
				error: 'collectionId and userId must be valid integers',
			} as ErrorDTO);
		}

		let addingUser = await client.query(
			`INSERT INTO collection_user_relationships ("collectionId", "userId", "permission") VALUES ($1, $2, $3) RETURNING *;`,
			[collectionId, userId, req.body.permission]
		);

		if (addingUser.rowCount !== 1) {
			return res.status(404).send({
				error: `couldn't create a relationship between collection & user`,
			} as ErrorDTO);
		}

		res.status(200).send({
			data: addingUser.rows,
		} as AddCollectionUserRelationshipDTO);
	} catch (error) {
		console.log(error);
		res.status(500).send({ error: 'something went wrong' } as ErrorDTO);
	}
};

export const getUsersByCollectionId = async (req: any, res: any) => {
	try {
		if (!req.params.collectionId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const getUserRes = await client.query(
			`
				SELECT u.*, r."collectionId", r."permission"
				FROM users u
				JOIN collection_user_relationships r ON u."userId" = r."userId"
				WHERE r."collectionId" = $1;
			`,
			[req.params.collectionId]
		);

		if (getUserRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such collection' });

		if (getUserRes.rowCount > 0) return res.status(200).send(getUserRes.rows);
	} catch (err) {
		return res.status(500).send({ error: err });
	}
};
