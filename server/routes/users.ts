import express from 'express';
import {
	createUser,
	deleteUserById,
	getUserById,
	getUserByFirebaseAuthId,
	updateUserById,
	getUserByEmail,
} from './route-helpers/users-helpers';
const router = express.Router();

router.post('/createUser', createUser);
router.delete('/deleteUserById/:userId', deleteUserById);
router.get('/getUserById/:userId', getUserById);
router.get('/getUserByEmail/:email', getUserByEmail);
router.get('/getUserByFirebaseAuthId/:firebaseAuthId', getUserByFirebaseAuthId);
router.put('/updateUserById/:userId', updateUserById);

module.exports = router;
