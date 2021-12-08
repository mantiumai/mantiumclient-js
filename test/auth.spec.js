require('dotenv').config();
const username = process.env.MANTIUM_USER_NAME;
const password = process.env.MANTIUM_PASSWORD;

const msg = require('../src/config/error-message');
const mantiumAi = require('../src/index');

const assert = require('chai').assert;

if (!username && !password)
  throw new Error(msg.errorMessages().env_missing);

describe('Auth methods', function () {
  it('should login and return the token', async function () {
    const loginResponse = await mantiumAi
      .Auth()
      .accessTokenLogin({
        username,
        password,
      })
      .then((response) => {
        mantiumAi.api_key = response.data.attributes.bearer_id;
        return response;
      });
    assert.equal(
      loginResponse.data.type,
      'auth_login',
      'auth type response is received'
    );
    assert.typeOf(mantiumAi.api_key, 'string', 'token received');
  });

  it('should logut and revoke the token', async function () {
    const revokeToken = await mantiumAi
      .Auth()
      .revokeToken()
      .then((response) => {
        return response;
      });
    assert.equal(
      revokeToken.data.type,
      'token_revoke',
      'revoke token type method is invoked'
    );
    assert.equal(
      revokeToken.data.attributes.message,
      'The authorization token has been successfully revoked'
    );
  });
});
