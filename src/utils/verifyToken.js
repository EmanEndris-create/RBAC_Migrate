const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { id, role } = decoded;
    // console.log('id', id);
    // console.log('role', role);
    return { id, role };
  } catch (err) {
    console.error('Error verifying token:', err);
    return err;
  }
};

module.exports = verifyToken;