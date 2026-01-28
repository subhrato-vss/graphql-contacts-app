const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { isAuth: false, userId: null };
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token || token === '') {
    return { isAuth: false, userId: null };
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return { isAuth: false, userId: null };
  }

  if (!decodedToken) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId: decodedToken.userId };
};

module.exports = auth;