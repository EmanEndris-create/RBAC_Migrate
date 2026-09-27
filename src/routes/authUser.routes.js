const express = require('express');
const authRoutes = express.Router();
const {signup, login,resetPassword, refreshToken} = require('../controllers/authUser.controller');


const  {authentication,allowedRoles} = require('../middlewares');

// Apply authentication middleware to all protected routes

authRoutes.get('/reset-password', resetPassword);
authRoutes.get('/refresh-token',refreshToken);

authRoutes.post('/signup',authentication,allowedRoles('admin'),signup);
authRoutes.post('/login', login);

module.exports = authRoutes;