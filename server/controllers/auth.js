import User from '../models/user.js';
import hashedPassword from '../services/auth.js';

export const signupUsers = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const passwordHash = await hashedPassword(password);

        // Create user with hashed password
        const user = new User({ name, email, password: passwordHash });

        // Save User
        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error});
    }
}