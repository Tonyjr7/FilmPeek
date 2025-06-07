import User from '../models/user.js';

import jwt from 'jsonwebtoken';

import { hashedPassword, matchPassword } from '../services/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const signupUsers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const lookUpUser = await User.findOne({ email });

    if (lookUpUser) {
      return res.status(400).json({ message: 'User with this email already existed' });
    }

    const passwordHash = await hashedPassword(password);
    const user = new User({ name, email, password: passwordHash });

    await user.save();

    // Convert to plain object and exclude password and __v
    const { password: _, __v, createdAt, updatedAt, ...safeUser } = user.toObject();

    res.status(201).json({ message: 'User created successfully', user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};

export const signinUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exits
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Comapare passwords
    const isMatched = await matchPassword(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: 'Wrong Password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
