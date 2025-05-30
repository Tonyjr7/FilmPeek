import User from '../models/user.js';

import jwt from 'jsonwebtoken';

import { hashedPassword, matchPassword } from '../services/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signupUsers = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const lookUpUser = await User.findOne({ email });

    if (lookUpUser) {
      return res.status(400).json({ message: 'User with this email already existed' });
    } else {
      // Hash the password
      const passwordHash = await hashedPassword(password);

      // Create user with hashed password
      const user = new User({ name, email, password: passwordHash });

      // Save User
      await user.save();

      res.status(201).json({ message: 'User created successfully', user });
    }
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
    res.status(500).json({ message: 'Login failed', error });
  }
};
