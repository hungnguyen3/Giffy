import { client } from '../../src/index';
import { ErrorDTO } from '../types/errors-types';
import {
	CreateUserDTO,
	GetUserByEmailDTO,
	DeleteUserDTO,
	GetCurrentUserDTO,
	GetUserByIdDTO,
	UpdateUserByIdDTO,
} from '../types/users-types';

export const createUser = async (req: any, res: any) => {
	try {
		if (!req.body.userName || !req.body.userEmail || !req.body.profileImgUrl)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			} as ErrorDTO);

		const insertUserRes = await client.query(
			`
        INSERT INTO users ("userName", "userEmail", "firebaseAuthId", "profileImgUrl")
        VALUES ($1, $2, $3, $4)
				RETURNING *;
      `,
			[
				req.body.userName,
				req.body.userEmail,
				req.user.uid,
				req.body.profileImgUrl,
			]
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
			} as ErrorDTO);

		const deleteUserRes = await client.query(
			`
			  DELETE FROM users WHERE "userId" = $1;
		  `,
			[req.params.userId]
		);

		if (deleteUserRes.rowCount <= 0)
			return res
				.status(500)
				.send({ error: 'There is no such user' } as ErrorDTO);

		if (deleteUserRes.rowCount === 1)
			return res.status(200).send({
				data: {
					successMessage:
						'you have successfully deleted a user uid: ' + req.params.userId,
				},
			} as DeleteUserDTO);

		if (deleteUserRes.rowCount > 1)
			return res
				.status(500)
				.send({ error: 'error occurred, more than one user with the same id' });
	} catch (err) {
		return res.status(500).send({ error: err } as ErrorDTO);
	}
};

export const getUserById = async (req: any, res: any) => {
	try {
		if (!req.params.userId)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			} as ErrorDTO);

		const getUserRes = await client.query(
			`
		      SELECT* FROM users WHERE "userId" = $1;
		    `,
			[req.params.userId]
		);

		if (getUserRes.rowCount <= 0)
			return res
				.status(500)
				.send({ error: 'There is no such user' } as ErrorDTO);

		if (getUserRes.rowCount === 1)
			return res
				.status(200)
				.send({ data: getUserRes.rows[0] } as GetUserByIdDTO);

		if (getUserRes.rowCount > 1)
			return res.status(500).send({
				error: 'error occurred, more than one user with the same id',
			} as ErrorDTO);
	} catch (err) {
		return res.status(500).send({ error: err } as ErrorDTO);
	}
};

export const getUserByEmail = async (req: any, res: any) => {
	try {
		if (!req.params.email)
			return res.status(400).send({
				error: 'missing required parameter(s)',
			});

		const getUserRes = await client.query(
			`
		      SELECT* FROM users WHERE "userEmail" = $1;
		    `,
			[req.params.email]
		);

		if (getUserRes.rowCount <= 0)
			return res.status(500).send({ error: 'There is no such user' });

		if (getUserRes.rowCount === 1)
			return res
				.status(200)
				.send({ data: getUserRes.rows[0] as GetUserByEmailDTO });

		if (getUserRes.rowCount > 1)
			return res
				.status(500)
				.send('error occurred, more than one user with the same id');
	} catch (err) {
		return res.status(500).send({ error: err });
	}
};

export const getCurrentUser = async (req: any, res: any) => {
	try {
		if (!req.user?.uid) {
			return res.status(400).send({
				error: 'Missing required parameter(s)',
			} as ErrorDTO);
		}

		const getUserRes = await client.query(
			`
      SELECT * FROM users WHERE "firebaseAuthId" = $1;
    `,
			[req.user.uid]
		);

		if (getUserRes.rowCount <= 0) {
			return res.status(404).send({ error: 'User not found' } as ErrorDTO);
		}

		if (getUserRes.rowCount === 1) {
			return res
				.status(200)
				.send({ data: getUserRes.rows[0] } as GetCurrentUserDTO);
		}

		if (getUserRes.rowCount > 1) {
			return res.status(500).send({
				error: 'Error occurred, more than one user with the same id',
			} as ErrorDTO);
		}
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
			} as ErrorDTO);

		const updateUserRes = await client.query(
			`
        UPDATE users
        SET "userName" = COALESCE($1, "userName"), "profileImgUrl"= COALESCE($2, "profileImgUrl")
        WHERE "userId" = $3 
							RETURNING *;`,

			[req.body.userName, req.body.profileImgUrl, req.params.userId]
		);
		if (updateUserRes.rowCount <= 0)
			return res
				.status(500)
				.send({ error: 'There is no such user' } as ErrorDTO);

		if (updateUserRes.rowCount === 1)
			return res.send({
				data: updateUserRes.rows[0],
			} as UpdateUserByIdDTO);

		if (updateUserRes.rowCount > 1)
			return res.status(500).send({
				error: 'error occurred, more than one user with the same id',
			} as ErrorDTO);
	} catch (err) {
		return res.status(500).send({ error: err } as ErrorDTO);
	}
};
