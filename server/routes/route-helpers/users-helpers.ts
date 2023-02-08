import { client } from '../../src/index';
import { ErrorDTO } from '../types/errors-types';
import {
	CreateUserDTO,
	GetUserByFirebaseAuthIdDTO,
} from '../types/users-types';

export const createUser = async (req: any, res: any) => {
	try {
		if (
			!req.body.userName ||
			!req.body.firebaseAuthId ||
			!req.body.profileImgUrl
		)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			} as ErrorDTO);

		const insertUserRes = await client.query(
			`
        INSERT INTO users ("userName", "firebaseAuthId", "profileImgUrl")
        VALUES ($1, $2, $3)
				RETURNING *;
      `,
			[req.body.userName, req.body.firebaseAuthId, req.body.profileImgUrl]
		);

		if (insertUserRes.rowCount === 1) {
			return res
				.status(200)
				.send({ data: insertUserRes.rows[0] } as CreateUserDTO);
		}

		return res.status(500).send({ error: 'Db error' } as ErrorDTO);
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			error: 'Db error while creating a user',
		} as ErrorDTO);
	}
};

export const deleteUserById = async (req: any, res: any) => {
	try {
		if (!req.params.userId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const deleteUserRes = await client.query(
			`
			  DELETE FROM users WHERE "userId" = $1;
		  `,
			[req.params.userId]
		);

		if (deleteUserRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such user' });

		if (deleteUserRes.rowCount === 1)
			return res
				.status(200)
				.send('you have successfully deleted a user uid: ' + req.params.userId);

		if (deleteUserRes.rowCount > 1)
			return res
				.status(500)
				.send({ error: 'error occurred, more than one user with the same id' });
	} catch (err) {
		return res.status(500).send({ error: err });
	}
};

export const getUserById = async (req: any, res: any) => {
	try {
		if (!req.params.userId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const getUserRes = await client.query(
			`
		      SELECT* FROM users WHERE "userId" = $1;
		    `,
			[req.params.userId]
		);

		if (getUserRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such user' });

		if (getUserRes.rowCount === 1)
			return res.status(200).send(getUserRes.rows[0]);

		if (getUserRes.rowCount > 1)
			return res
				.status(500)
				.send('error occurred, more than one user with the same id');
	} catch (err) {
		return res.status(500).send({ error: err });
	}
};

export const getUserByFirebaseAuthId = async (req: any, res: any) => {
	try {
		if (!req.params.firebaseAuthId)
			return res.status(400).send({
				error: 'Missing required parameter(s)',
			} as ErrorDTO);

		const getUserRes = await client.query(
			`
		      SELECT* FROM users WHERE "firebaseAuthId" = $1;
		    `,
			[req.params.firebaseAuthId]
		);

		if (getUserRes.rowCount <= 0)
			return res
				.status(500)
				.send({ error: 'There is no such user' } as ErrorDTO);

		if (getUserRes.rowCount === 1)
			return res
				.status(200)
				.send({ data: getUserRes.rows[0] } as GetUserByFirebaseAuthIdDTO);

		if (getUserRes.rowCount > 1)
			return res.status(500).send({
				error: 'Error occurred, more than one user with the same id',
			} as ErrorDTO);
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			error: 'Unknown db error',
		} as ErrorDTO);
	}
};

export const updateUserById = async (req: any, res: any) => {
	try {
		if (!req.params.userId || !req.body.userName || !req.body.profileImgUrl)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const updateUserRes = await client.query(
			`
        UPDATE users
        SET "userName" = COALESCE($1, "userName"), "profileImgUrl"= COALESCE($2, "profileImgUrl")
        WHERE "userId" = $3;
      `,
			[req.body.userName, req.body.profileImgUrl, req.params.userId]
		);
		if (updateUserRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such user' });

		if (updateUserRes.rowCount === 1)
			return res
				.status(200)
				.send('you have successfully update a user uid: ' + req.params.userId);

		if (updateUserRes.rowCount > 1)
			return res
				.status(500)
				.send({ error: 'error occurred, more than one user with the same id' });
	} catch (err) {
		return res.status(500).send({ error: err });
	}
};
