# HapiJS OIDC-JWKS authentication strategy for HapiJS

This plugin is based on https://github.com/PDMLab/express-oidc-jwks-verify middleware for expressJS.


Instalation:

```
npm install hapijs-oidc-jwks-strategy

```

Usage:

```
const oidcJwks = require('hapijs-oidc-jwks-strategy');

server.register(oidcJwks, { issuer : "<issuer base URL>"});

```
