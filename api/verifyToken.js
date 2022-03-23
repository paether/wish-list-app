const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verify = (req, res, next) => {
  let { token } = req.headers;
  if (token) {
    [, token] = token.split(' ');
    jwt.verify(token, process.env.REACT_APP_JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) return res.status(403).json('Bad token!');
      req.listId = decoded.listId;
      req.isAdmin = decoded.isAdmin;
      next();
    });
  } else {
    return res.status(401).json('Not authenticated!');
  }
};

module.exports = verify;
