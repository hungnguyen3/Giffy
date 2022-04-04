import express from 'express';
import {
	createUser,
	deleteUserById,
	getUserById,
} from './route-helpers.ts/users-helpers';
const router = express.Router();

router.post('/createUser', createUser);
router.delete('/deleteUserById/:userId', deleteUserById);
router.get('/getUserById/:userId', getUserById);

module.exports = router;
