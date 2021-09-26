
<h3 align="center">Mantium</h3>

## Table of Contents
- [Quickstart](#quickstart)
- [Authentication](#authentication)
- [Installation](#installation)
- [Usage](#usage)
  - [Initializing](#initializing)
  - [Auth](#auth)
    - [Login](#login)
    - [Logout](#logout)
    - [Reset Password](#reset-password)
## Authentication
Make an account by visiting [app.mantiumai.com](https://app.mantiumai.com) and selecting register. Enter your email address and create a password. After you verify the email, you'll be able to sign in to the Mantium application. You'll also need your username and password to obtain a token for API use.

## Quickstart:
Read the [getting started guide](https://developer.mantiumai.com/docs) for more information on how to use Mantium.

## Installation
You need [Node.js](https://nodejs.org/en/) installed on your computer. To install JavaScript Library please use following command

```js
  npm install mantiumclient-js
```

## Usage

### Initializing
```js
  const mantiumAi = require('mantiumclient-js');

  // bearer_id is received in response after successful login using auth login method.
  mantiumAi.api_key = bearer_id

  // bearer_id is required to pass in every header as value for Authorization.
```

### Auth
get started with the login and use the API

#### Login
Obtain access token for a user
Requirements:
username: user's username
password: user's password
[document link](https://developer.mantiumai.com/reference#access_token_login_v1_auth_login_access_token_post)

```js
const mantiumAi = require('mantiumclient-js');

(async () => {
  const loginResponse = await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set as a api_key
      mantiumAi.api_key = response.data.attributes.bearer_id;
      return response;
    });
  console.log(loginResponse);
  console.log('Token', mantiumAi.api_key);
})();
```
#### Example of a successful completion response
```js
{
  data: {
    id: 'some-long-id',
    type: 'auth_login',
    attributes: {
      bearer_id: 'some-long-bearer-id',
      expires_on: '2021-09-27T15:19:50+00:00',
      token_type: 'Bearer'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```

#### Logout
Invalidate a user's Access token (logout)
Requires HTTP Authorization with the bearer_id
Requirements:
bearer_id: bearer id
[document link](https://developer.mantiumai.com/reference#revoke_token_v1_auth_user_revoke_token_post)
```js
onst mantiumAi = require('mantiumclient-js');

// This method throw error as we are not passing the Authorization [bearer_id]
(async () => {
  const logoutResponse = await mantiumAi.Auth().resetPassword({
    email: 'useremail@somedomain.com'
  })
    .then((response) => {
      return response;
    });
})();

// Correct way to do this

(async () => {
  const loginResponse = await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
      return response;
    });
  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  const logoutResponse = await mantiumAi.Auth().revokeToken().then((response) => {
    return response;
  });
  console.log(logoutResponse);
})();
```
#### Example of a successful completion response
```js
{
  data: {
    id: 'some-long-id',
    type: 'token_revoke',
    attributes: {
      error: null,
      message: 'The authorization token has been successfully revoked'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```

#### Reset Password
Triggers a password reset user's password. An email with a link would be sent
Requires HTTP Authorization with the bearer_id
Requirements:
email: user's registered email
[document link](https://developer.mantiumai.com/reference#reset_password_v1_auth_user_reset_password_post)

```js
  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  const loginResetResponse = await mantiumAi.Auth().resetPassword({
    email: 'useremail@somedomain.com'
  }).then((response) => {
    return response;
  });
```
#### Example of a successful completion response
```js
{
  data: {
    id: 'some-long-id',
    type: 'password_reset',
    attributes: { error: null, message: 'Operation was successful' },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```