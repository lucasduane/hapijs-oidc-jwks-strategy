'use strict';

const async = require('async');
const formatCertificate = require('./lib/formatcertificate');
const fs = require('fs');
const jwtVerify = require('./lib/verifyjwt');
const NodeRSA = require('node-rsa');
const path = require('path');
const request = require('request');
const urlJoin = require('url-join');
const x509 = require('x509');
const Boom = require('boom');

const OIDC_DISCOVERY_PATH = '/.well-known/openid-configuration';

module.exports = (server, options) => {
  if (!options) {
    throw new Error("Options are missing.");
  }

  if (!options.issuer) {
    throw new Error("Issuer option is missing.");
  }

  const issuer = options.issuer;

  const OIDC_DISCOVERY_URI = urlJoin(issuer, OIDC_DISCOVERY_PATH);

  let publicKey = null;

  const authenticate = (request, reply) => {
    if (request.method.toLowerCase() === 'options' && !request.headers['Authorization']) {
      return reply.continue();
    }

    if (!publicKey) {
      async.waterfall([
        callback => request.get(OIDC_DISCOVERY_URI, (err, discoveryResponse) => {
          return err
            ? callback(err)
            : callback(null, JSON.parse(discoveryResponse.body).jwks_uri);
        }),

        (jwksUri, callback) => request.get(jwksUri, (err, jwksResponse) => {
          return err
            ? callback(err)
            : callback(null, JSON.parse(jwksResponse.body).keys[0].x5c[0]);
        }),

        (x5c, callback) => {
          const x5cFormatted = formatCertificate(x5c);
          const certFilename = path.join(__dirname, 'tmp.crt');

          fs.writeFileSync(certFilename, x5cFormatted, { encoding : 'UTF-8'});
          const parsedKey = x509.parseCert(certFilename);
          const key = new NodeRSA();

          key.importKey({
            n : new Buffer(parsedKey.publicKey.n, 'hex'),
            e : parseInt(parsedKey.publicKey.e, 10)
          }, 'components-public');

          publicKey = key.exportKey('public');

          return callback(null);
        },
      ], (err) => {
        if (err) {
          return reply(Boom.internal());
        }

        jwtVerify(request, publicKey, (verificationError, credentials) => {
          if (verificationError) {
            return reply(Boom.unauthorized());
          }

          return reply.continue({ credentials });
        });
      });
    }

  };

  return {
    authenticate,
  };
};
