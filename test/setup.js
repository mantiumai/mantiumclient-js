require('dotenv').config();
const msg = require('../src/config/error-message');

const username = process.env.MANTIUM_USER_NAME;
const password = process.env.MANTIUM_PASSWORD;

const mantiumAi = require('../src/index');

if (!username && !password) throw new Error(msg.errorMessages().env_missing);

// root hook to run before every test (even in other files)
beforeEach(async function () {
  await mantiumAi
    .Auth()
    .accessTokenLogin({
      username,
      password,
    })
    .then((response) => {
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });
});
