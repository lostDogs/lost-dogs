// dependencies
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User');

const authUser = (jwtPayload, callback) => {
  User.findOne({
    username: jwtPayload.username,
  }, (err, user) => {
    if (err || !user) {
      return callback(false);
    }

    return user.compareToken(jwtPayload.token, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return callback(false);
      }

      return callback(true, user);
    });
  });
};

const validateToken = (token) => {
  if (!token) {
    return Promise.reject({
      statusCode: 401,
      code: 'No token found.',
    });
  }

  if (!/token [\S]*/.test(token)) {
    return Promise.reject({
      statusCode: 400,
      code: 'Malformed token.',
    });
  }

  return new Promise((resolve, reject) => (
    jwt.verify(token.split(' ')[1], process.env.SESSION_SECRET, { algorithms: ['HS384'] }, (verifyError, jwtPayload) => {
      if (verifyError) {
        return reject({
          statusCode: 401,
          code: 'Not a valid token.',
        });
      }

      return authUser(jwtPayload, (isAuthed, user) => {
        if (!isAuthed) {
          return reject({
            statusCode: 401,
            code: 'Not a valid token.',
          });
        }

        return resolve(user);
      });
    })
  ));
};

module.exports.validateToken = validateToken;

module.exports.signToken = jwtPayload => (
  new Promise((resolve, reject) => {
    jwt.sign(jwtPayload, process.env.SESSION_SECRET, { algorithm: 'HS384' }, (err, token) => {
      if (err) {
        return reject({
          statusCode: 500,
          code: 'Error signing token.',
        });
      }

      return resolve(token);
    });
  })
);

module.exports.middleware = (req, res, next) => {
  const token = req.headers.Authorization || req.headers.authorization;

  validateToken(token)

    .then((user) => {
      req.user = user;
      next();
    }, err => (
      res.status(err.statusCode).json(err)
    ));
};
