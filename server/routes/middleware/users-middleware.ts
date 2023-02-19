import { client } from '../../src';
import { ErrorDTO } from '../types/errors-types';

export const verifyUser = async (req: any, res: any, next: any) => {
	try {
		// Extract the userId and firebaseAuthId from the request
		const { userId } = req.params;
		const { uid } = req.user;

		// Get the user from the database by their userId
		const getUserRes = await client.query(
			`
        SELECT * FROM users WHERE "userId" = $1;
      `,
			[userId]
		);

		// Check if the user exists in the database
		if (getUserRes.rowCount !== 1) {
			return res.status(404).send({
				error: 'User not found',
			} as ErrorDTO);
		}

		// Get the hashed firebaseAuthId from the user object in the database
		const { firebaseAuthId } = getUserRes.rows[0];

		if (!(firebaseAuthId === uid)) {
			return res.status(401).send({
				error: 'Unauthorized, failed to verify matching identities',
			});
		}

		// If the user is authorized, call the next middleware in the chain
		next();
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			error: 'Unknown db error',
		});
	}
};
