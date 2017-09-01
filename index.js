'use strict';

const oidcJwksSchema = require('./oidc-jwks-schema');

const SCHEMA_NAME = 'oidc-jwks';
const STRATEGY_NAME = 'oidc-jwks-strategy';

const plugin = {
  register(server, options, next) {

    server.auth.scheme(SCHEMA_NAME, oidcJwksSchema);

    server.auth.strategy(STRATEGY_NAME, SCHEMA_NAME, true, options);

    next();
  }
};

plugin.register.attributes = {
  name : 'oidcJwks',
  version : '1.0.0'
};

module.exports = plugin;
