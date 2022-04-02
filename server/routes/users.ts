import express from 'express';
import { createUser, deleteUser } from './route-helpers.ts/users-helpers';
const router = express.Router();

router.post('/createUser', createUser);
router.get('/deleteUser', deleteUser);

module.exports = router;
