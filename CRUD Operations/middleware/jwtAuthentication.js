const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants');

function generateToken(user) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; 
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { 
    generateToken, 
    authenticateJWT 
};
