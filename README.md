
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
  - [Tags](#tags)
    - [List Tags](#list-tags)
    - [Create a Tag](#create-a-tag)
    - [Get Tag using ID url](#get-tag-using-id-url)
    - [Get Tag ](#get-tag)
    - [Update Tag](#update-tag)
    - [Delete Tag](#delete-tag)
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


### Tags

#### List Tags

Get all of the tags for your selected organization.  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  

[document link](https://developer.mantiumai.com/reference#list_tags_v1_tag__get)

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
  await mantiumAi.Tags().list({ 'page': 1, 'size': 20 }).then((response) => {
    console.log('*********** Tag list *********');
    console.log(response);
  });
})();
```

#### Example of a successful completion response
```js
{
  data: [
    {
      id: 'some-long-id',
      type: 'tag',
      attributes: {
        tag_id: 'some-long-id',
        name: 'My Tag',
        description: 'This is a description',
        organization_id: 'some-long-id',
        created_by: 'user-some-long-id',
        created_at: '2021-09-28T07:33:05.064629+00:00',
        updated_by: null,
        updated_at: null
      },
      relationships: {}
    }
  ],
  included: [],
  meta: {},
  links: { total_items: 1, current_page: 1 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Create a Tag

Name (string) Tag name  
Description (string) Optional value for tags used to add additional data regarding a tag  

[document link](https://developer.mantiumai.com/reference#post_tag_v1_tag__post)
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
  await mantiumAi.Tags().create({
    name: 'tag name 1',
    description: 'Some description'
  }).then((response) => {
    console.log('*********** Tag create *********');
    console.log(response);
  });
})();
```
#### Example of a successful completion response
```js
{
  data: {
    id: 'some-long-id',
    type: 'tag',
    attributes: {
      tag_id: 'some-long-id',
      name: 'tag name 1',
      description: 'Some description',
      organization_id: 'organization-some-long-id',
      created_by: 'user-some-long-id',
      created_at: '2021-09-28T08:15:12.797516+00:00',
      updated_by: null,
      updated_at: null
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Get Tag using ID url

Get details about a specific tag.  

Tag Id* (string)* required parameter  

[document link](https://developer.mantiumai.com/reference#get_tag_v1_tag_id__tag_id__get)
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
  await mantiumAi.Tags().retreiveId('some-long-id').then((response) => {
    console.log('*********** Tag Retreive by id *********');
    console.log(response.data);
  });
})();
```
#### Example of a successful completion response
```js
// *********** Tag Retreive by id *********
{
  id: 'some-long-id',
  type: 'tag',
  attributes: {
    created_at: '2021-09-28T08:15:12.797516+00:00',
    updated_at: null,
    tag_id: 'some-long-id',
    organization_id: 'organization-some-long-id',
    name: 'tag name 1',
    description: 'Some description',
    created_by: 'user-some-long-id',
    updated_by: null
  },
  relationships: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Get Tag 

Get details about a specific tag.  

Tag Id* (string)* required parameter  

[document link](https://developer.mantiumai.com/reference#get_tag_v1_tag__tag_id__get)
```js
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
  await mantiumAi.Tags().retreive('some-long-id').then((response) => {
    console.log('*********** Tag Retreive *********');
    console.log(response.data);
  });
})();
```

#### Example of a successful completion response
```js
*********** Tag Retreive *********
{
  id: 'some-long-id',
  type: 'tag',
  attributes: {
    created_at: '2021-09-28T08:15:12.797516+00:00',
    updated_at: null,
    tag_id: 'some-long-id',
    organization_id: 'organization-some-long-id',
    name: 'tag name 1',
    description: 'Some description',
    created_by: 'user-some-long-id',
    updated_by: null
  },
  relationships: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Update Tag

Update details about a specific tag.  

Tag Id* (string)* required parameter  
[document link](https://developer.mantiumai.com/reference#patch_tag_v1_tag__tag_id__patch)
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
  await mantiumAi.Tags().update({
    id: 'some-long-id',
    name: 'New tag name',
    description: 'Some long description'
  }).then((response) => {
    // save this tag id to edit the same tag
    tag_id = response.data.attributes.tag_id;
    console.log('*********** Tag updated *********');
    console.log(response);
  });
})();
```
#### Example of a successful completion response
```js
// *********** Tag updated *********
{
  data: {
    id: 'some-long-id',
    type: 'tag',
    attributes: {
      created_at: '2021-09-28T08:15:12.797516+00:00',
      updated_at: '2021-09-28T08:27:19.940023+00:00',
      tag_id: 'some-long-id',
      organization_id: 'organization-some-long-id',
      name: 'New tag name',
      description: 'Some long description',
      created_by: 'user-some-long-id',
      updated_by: 'user-some-long-id'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


#### Delete Tag
Delete a specific tag.  

Tag Id* (string)* required parameter  
[document link](https://developer.mantiumai.com/reference#delete_tag_v1_tag__tag_id__delete)
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
  await mantiumAi.Tags().remove('some-long-id').then((response) => {
    // save this tag id to edit the same tag
    tag_id = response.data.attributes.tag_id;
    console.log('*********** Tag remove *********');
    console.log(response);
  });
})();
```
#### Example of a successful completion response
```js
// *********** Tag remove *********
{
  data: {
    id: 'some-long-id',
    type: 'tag',
    attributes: {
      created_at: '2021-09-28T08:15:12.797516+00:00',
      updated_at: '2021-09-28T08:27:19.940023+00:00',
      tag_id: 'some-long-id',
      organization_id: 'organization-some-long-id',
      name: 'New tag name',
      description: 'Some long description',
      created_by: 'user-some-long-id',
      updated_by: 'user-some-long-id'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)