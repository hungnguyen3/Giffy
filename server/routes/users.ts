import express from 'express';
import { mandatoryAuthCheck } from './middleware/auth-middleware';
import { verifyUser } from './middleware/users-middleware';
import {
	createUser,
	deleteUserById,
	getCurrentUser,
	getUserById,
	updateUserById,
	getUserByEmail,
} from './route-helpers/users-helpers';
const router = express.Router();

router.post('/createUser', mandatoryAuthCheck, createUser);
router.delete(
	'/deleteUserById/:userId',
	mandatoryAuthCheck,
	verifyUser,
	deleteUserById
);
router.get('/getUserById/:userId', mandatoryAuthCheck, verifyUser, getUserById);
router.get('/getCurrentUser', mandatoryAuthCheck, getCurrentUser);
router.put(
	'/updateUserById/:userId',
	mandatoryAuthCheck,
	verifyUser,
	updateUserById
);
router.get(
	'/getUserByEmail/:email',
	getUserByEmail,
	mandatoryAuthCheck,
	verifyUser,
	getUserById
);

module.exports = router;
