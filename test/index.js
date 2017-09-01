const assert = require('assert');

const strategy = require('../oidc-jwks-schema');

const serverMock = {
  auth : {
    scheme : (name, scheme) => {},
    strategy : () => {},
  },
};

describe('Strategy Schema', () => {
  describe('When options are missing', () => {
    it ('should return an error', done => {
      try {
        strategy(serverMock);
      } catch (err) {
        assert.equal('Error: Options are missing.', err.toString());
        return done();
      }
    })
  });

  describe('when issuer option is missing', () => {
    it('should return an error', done => {
      try {
        strategy(serverMock, {});
      } catch (err) {
        assert.equal('Error: Issuer option is missing.', err.toString());

        return done();
      }
    });
  });
});
