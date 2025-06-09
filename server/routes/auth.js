import express from 'express';
import { signupUsers, signinUsers } from '../controllers/auth.js';
import { fetchUserProfile } from '../controllers/auth.js';

import verifyToken from '../services/verifyToken.js';

const router = express.Router();

router.post('/signup', signupUsers);

router.post('/signin', signinUsers);

router.get('/user/profile', verifyToken, fetchUserProfile);

export default router;
