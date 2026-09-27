const {hashPassword, comparePassword} = require('../utils/hashPwd');
const { checkUserExists, createUser, updateUserPassword ,getUserById} = require('../models/user.model');
const { generateToken } = require('../utils/generateToken');
const { generatePassword } = require('../utils/generateTempoPassword');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    console.log('Signup request body:', req.body);
    const existingUser = await checkUserExists(username);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const hashedPassword = await hashPassword(password);
        const response = await createUser(username, hashedPassword, full_name, role);

res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const existingUser = await checkUserExists(username);
    if (!existingUser) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await comparePassword(password, existingUser.password_hash);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    const { accesstoken, refreshToken } = generateToken({ id: existingUser.id, role: existingUser.role });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: 'Login successful', accesstoken });
};
exports.refreshToken = async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const { id } = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const result = await getUserById(id);
        if (!result.rows[0]) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const role = result.rows[0].role;
        const { accesstoken, refreshToken } = generateToken({ id, role });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Refresh token successful', accesstoken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.resetPassword = async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        const user = await checkUserExists(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
     const newPassword = await generatePassword(6);
     const password = await hashPassword(newPassword);
     console.log('password', password);
     if (!password) {
            return res.status(500).json({ message: 'failed to generate the password' });
     }
     const updatePassword = await updateUserPassword(user.id, password);
        if (!updatePassword.rows[0]) {
            return res.status(500).json({ message: 'failed to reset the password' });
        }
        console.log('updatePassword', updatePassword.rows[0].password_hash);
        console.log('Generated password:', newPassword);

        res.status(200).json({ message: 'Password reset successful', newPassword });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};