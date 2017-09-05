'use strict';

const jwt = require('jsonwebtoken');

const verifyJwt = function (request, publicKey, callback) {
  const header = request.headers['authorization'];

  if (!header) {
    callback(new Error('Authorization header is not present.'));
  }

  const token = header.replace(/Bearer /, '');

  jwt.verify(token, publicKey, { format: 'PKCS8', algorithms: [ 'RS256' ]}, (errVerify, decoded) => {
    if (errVerify) {
      return callback(errVerify);
    }

    return callback(null, decoded);
  });
};

module.exports = verifyJwt;
