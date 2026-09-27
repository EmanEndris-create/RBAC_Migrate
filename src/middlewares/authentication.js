const verifyToken = require('../utils/verifyToken');

async function authentication(req, res, next) {

    // console.log('🔥 AUTHENTICATION RUNNING');

    const authHeader = req.headers.authorization || req.headers.Authorization;

    // console.log('Authorization header:', authHeader);

    if (!authHeader) {
        // console.log(' No authorization header');

        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    try {
        const token = authHeader.split(' ')[1];

        // console.log('Token exists:', !!token);

        const decoded = verifyToken(token);

        // console.log('Decoded user:', decoded);

        if (!decoded) {
            // console.log('❌ Token verification failed');

            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        req.user = decoded;

        // console.log('✅ req.user:', req.user);

        next();

    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
}

module.exports = authentication;