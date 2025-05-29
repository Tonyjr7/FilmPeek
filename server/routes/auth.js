import express from 'express';
import User from '../models/user.js';
import { signupUsers } from '../controllers/auth.js';

const router = express.Router();

router.post("/signup", signupUsers);

export default router;