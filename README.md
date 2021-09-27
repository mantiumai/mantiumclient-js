
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
  - [AI Methods](#ai-methods)
    - [List Methods](#list-methods)
  - [AI Engines](#ai-engines)
    - [Get All AI Engines](#get-all-ai-engines)
    - [Get Ai Engines By Provider](#get-ai-engines-by-provider)
    - [Get Ai Engine By Name](#get-ai-engine-by-name)
## Quickstart:
Read the [getting started guide](https://developer.mantiumai.com/docs) for more information on how to use Mantium.
## Authentication
Make an account by visiting [app.mantiumai.com](https://app.mantiumai.com) and selecting register. Enter your email address and create a password. After you verify the email, you'll be able to sign in to the Mantium application. You'll also need your username and password to obtain a token for API use.

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
[Go to Table of Contents](#table-of-contents)

#### Logout
Invalidate a user's Access token (logout)  
Requires HTTP Authorization with the bearer_id  
Requirements:  
bearer_id: bearer id  
[document link](https://developer.mantiumai.com/reference#revoke_token_v1_auth_user_revoke_token_post)
```js
const mantiumAi = require('mantiumclient-js');

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
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
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
[Go to Table of Contents](#table-of-contents)

#### Reset Password
Triggers a password reset user's password. An email with a link would be sent  
Requires HTTP Authorization with the bearer_id  
Requirements:  
email: user's registered email  
[document link](https://developer.mantiumai.com/reference#reset_password_v1_auth_user_reset_password_post)

```js
 const mantiumAi = require('mantiumclient-js');

(async () => {
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });

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
  console.log('*********** resetPassword *********');
  console.log(loginResetResponse);

})();
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
[Go to Table of Contents](#table-of-contents)
### AI Methods
Get all of the supported ai_methods for a provider  
#### List Methods

Require AI Provider name (case sensitive)*  
[document link](https://developer.mantiumai.com/reference#get_ai_engine_by_name_v1_ai_engine_get_name__name__get)

```js
const mantiumAi = require('mantiumclient-js');

(async () => {
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });
  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */

  await mantiumAi.AiMethods('openai').list({ 'page': 1, 'size': 20 }).then((response) => {
    console.log(response);
  });

})();
```
#### Example of a successful completion response
```js
{
  data: [
    {
      id: 'type',
      type: 'object',
      attributes: {
        name: 'answers',
        api_name: 'answers',
        description: 'Returns answers',
        shareable: false,
        ai_provider: { 
          name: 'OpenAI',
          description: 'OpenAI -- https://openai.org'
        },
        ai_engines: [
          {
            name: 'davinci',
            use_cases: 'some use cases',
            description: 'Some long description',
            cost_ranking: 100
          }
        ]
      },
      relationships: {}
    }
  ],
  included: [],
  meta: {},
  links: { total_items: 4, current_page: 1 }
}
```
[Go to Table of Contents](#table-of-contents)
### AI Engines
Get available AI engines  
#### Get All AI Engines
Get all of the configured and available AI engines  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  
[document link](https://developer.mantiumai.com/reference#get_all_ai_engines_v1_ai_engine_all_get)

```js
const mantiumAi = require('mantiumclient-js');

(async () => {
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });

  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  await mantiumAi.AiEngines().all({ 'page': 1, 'size': 20 }).then((response) => {
    console.log(response);
  });
})();
```

#### Example of a successful completion response
```js
{
  data: [
    {
    id: 'davinci',
    type: 'ai_engine',
    attributes: {
      name: 'davinci',
      description: 'Some long description',
      use_cases: 'some use cases',
      ai_provider: 'OpenAI',
      cost_ranking: '100'
    },
    relationships: {}
  }],
  included: [],
  meta: {},
  links: { total_items: 17, current_page: 1 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Get AI Engines By Provider
List all of the AI Engines for a specific AI Provider  
AI Provider name (case sensitive)  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  

[document link](https://developer.mantiumai.com/reference#get_ai_engines_by_provider_v1_ai_engine_get_ai_providers__ai_provider__get)  
```js
const mantiumAi = require('mantiumclient-js');

(async () => {
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });

  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  const providers = ["openai",
    "cohere",
    "mantium",
    "OpenAI",
    "Cohere",
    "Mantium"];

  for (let provider of providers) {
    const methodResponse = await mantiumAi.AiEngines(provider).byProvider({ 'page': 1, 'size': 20 }).then((response) => {
      return response;
    });
    console.log(methodResponse);
  }

})();
```

#### Example of a successful completion response
```js
// *********** Response for Cohere ***********
{
  data: [
    {
      id: 'baseline-shrimp',
      type: 'ai_engine',
      attributes: {
        name: 'baseline-shrimp',
        description: 'Some long description',
        use_cases: 'some use cases',
        ai_provider: 'Cohere',
        cost_ranking: '24'
      },
      relationships: {}
    }
  ],
  included: [],
  meta: {},
  links: { total_items: 9, current_page: 1 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Get AI Engine By Name
Get the details for a specific AI Engine  

require: AI Engine name

[document link](https://developer.mantiumai.com/reference#get_ai_engine_by_name_v1_ai_engine_get_name__name__get)
```js
const mantiumAi = require('mantiumclient-js');

(async () => {
  await mantiumAi.Auth().accessTokenLogin({
    username: 'useremail@somedomain.com',
    password: 'p@ssWord!'
  })
    .then((response) => {
      // get bearer_id and set to default
      mantiumAi.api_key = response.data.attributes.bearer_id;
    });
  /*
  * API Key is set on above 
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  await mantiumAi.AiEngines('ada').byName().then((response) => {
    console.log(response);
  });

})();
```

#### Example of a successful completion response
```js
// *********** Response for ada ***********
{
  data: {
    id: 'ada',
    type: 'ai_engine',
    attributes: {
      name: 'ada',
      description: 'Some long description',
      use_cases: 'some use cases',
      ai_provider: 'OpenAI',
      cost_ranking: '70'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)
