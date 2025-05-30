import express from 'express';
import User from '../models/user.js';
import { signupUsers, signinUsers } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', signupUsers);

router.post('/signin', signinUsers);

export default router;
