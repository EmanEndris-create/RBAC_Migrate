const jwt = require('jsonwebtoken');

 exports.generateToken = ({ id, role }) => {
  console.log('id', id);
  console.log('role', role);
  const accesstoken = jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return { accesstoken, refreshToken };
};
