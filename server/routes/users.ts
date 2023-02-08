import express from 'express';
import {
	createUser,
	deleteUserById,
	getUserById,
	getUserByFirebaseAuthId,
	updateUserById,
} from './route-helpers/users-helpers';
const router = express.Router();

router.post('/createUser', createUser);
router.delete('/deleteUserById/:userId', deleteUserById);
router.get('/getUserById/:userId', getUserById);
router.get('/getUserByFirebaseAuthId/:firebaseAuthId', getUserByFirebaseAuthId);
router.put('/updateUserById/:userId', updateUserById);

module.exports = router;
