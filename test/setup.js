require('dotenv').config();

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const mantiumAi = require('../lib/index');

if (!username && !password) {
  throw new Error(
    'username and password are needed to run testsuite: set environment variable: USER_NAME and PASSWORD'
  );
}

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
