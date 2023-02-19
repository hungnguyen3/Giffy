import express from 'express';
import auth from './middleware/auth-middleware';
import { verifyUser } from './middleware/users-middleware';
import {
	createUser,
	deleteUserById,
	getCurrentUser,
	getUserById,
	updateUserById,
} from './route-helpers/users-helpers';
const router = express.Router();

router.post('/createUser', auth, createUser);
router.delete('/deleteUserById/:userId', auth, verifyUser, deleteUserById);
router.get('/getUserById/:userId', auth, verifyUser, getUserById);
router.get('/getCurrentUser', auth, getCurrentUser);
router.put('/updateUserById/:userId', auth, verifyUser, updateUserById);

module.exports = router;
