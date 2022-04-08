import { client } from '../../src/index';

export const createUser = async (req: any, res: any) => {
	await client
		.query(
			`
        INSERT INTO users ("userName", "firebaseAuthId", "profileImgUrl")
        VALUES ($1, $2, $3);
      `,
			[req.body.userName, req.body.firebaseAuthId, req.body.profileImgUrl]
		)
		.then(() => res.status(200).send('you have successfully created a user'))
		.catch((e: any) => {
			res.status(404).json({ error: e });
		});
};

export const deleteUserById = async (req: any, res: any) => {
	await client
		.query(
			`
			DELETE FROM users WHERE "userId" = $1;
		  `,
			[req.params.userId]
		)
		.then((dbRes: any) => {
			if (dbRes.rowCount === 0) res.status(404).send('There is no such user');

			if (dbRes.rowCount === 1) {
				res
					.status(200)
					.send(
						'you have successfully deleted a user uid: ' + req.params.userId
					);
			}

			if (dbRes.rowCount > 1) {
				res
					.status(404)
					.send('error occurred, more than one user with the same id');
			}
		})

		.catch((e: any) => res.status(404).json({ error: e }));
};

export const getUserById = async (req: any, res: any) => {
	await client
		.query(
			`
		    SELECT* FROM users WHERE "userId" = $1;
		  `,
			[req.params.userId]
		)
		.then((dbRes: any) => {
			if (dbRes.rowCount === 0) res.status(404).send('There is no such user');

			if (dbRes.rowCount === 1) res.status(200).send(dbRes.rows[0]);

			if (dbRes.rowCount > 1)
				res
					.status(404)
					.send('error occurred, more than one user with the same id');
		})
		.catch((e: any) => res.status(404).json({ error: e }));
};

export const updateUserById = async (req: any, res: any) => {
	await client
		.query(
			`
        UPDATE users
        SET "userName" = COALESCE($1, "userName"), "profileImgUrl"= COALESCE($2, "profileImgUrl")
        WHERE "userId" = $3;
      `,
			[req.body.userName, req.body.profileImgUrl, req.params.userId]
		)
		.then((dbRes: any) => {
			if (dbRes.rowCount === 0) res.status(404).send('There is no such user');

			if (dbRes.rowCount === 1) {
				res
					.status(200)
					.send(
						'you have successfully update a user uid: ' + req.params.userId
					);
			}

			if (dbRes.rowCount > 1) {
				res
					.status(404)
					.send('error occurred, more than one user with the same id');
			}
		})
		.catch((e: any) => {
			res.status(404).json({ error: e });
		});
};
