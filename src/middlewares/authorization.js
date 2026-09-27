
 function allowedRoles(...roles) {
    return async (req, res, next) => {
        const { role } = req.user;
        // const allowedRoles=[roles];
        // console.log('Allowed roles:', roles);
        // console.log('User role:', role);
        if (roles.includes(role)) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    };
}

module.exports = allowedRoles;