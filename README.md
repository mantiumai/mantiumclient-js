
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
  - [Prompts](#prompts)
    - [List Prompts](#list-prompts)
    - [Create a Prompt](#create-a-prompt)
    - [Update Prompt](#update-prompt)
    - [Get Prompt using ID url](#get-prompt-using-id-url)
    - [Get Prompt ](#get-prompt)
    - [Delete Prompt](#delete-prompt)
    - [Execute Prompt](#execute-prompt)
    - [Get Prompt Result](#get-prompt-result)

## Quickstart:
Read the [getting started guide](https://developer.mantiumai.com/docs) for more information on how to use Mantium.
## Authentication
- Make an account by visiting [app.mantiumai.com](https://app.mantiumai.com) and select Register.
- Enter your email address and create a password. After you've verified the email, you'll be able to sign in to the Mantium application. You'll also need your username and password to obtain a token for API use.

## Installation
Install [Node.js](https://nodejs.org/en/) on your computer. To install JavaScript Library please use the following command.

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
[Document link](https://developer.mantiumai.com/reference#access_token_login_v1_auth_login_access_token_post)

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
[Document link](https://developer.mantiumai.com/reference#revoke_token_v1_auth_user_revoke_token_post)
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

### AI Methods
Get all of the supported ai_methods for a provider
#### List Methods

Require AI Provider name (case sensitive)*
[Document link](https://developer.mantiumai.com/reference#get_ai_engine_by_name_v1_ai_engine_get_name__name__get)

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
[Document link](https://developer.mantiumai.com/reference#get_all_ai_engines_v1_ai_engine_all_get)

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

[Document link](https://developer.mantiumai.com/reference#get_ai_engines_by_provider_v1_ai_engine_get_ai_providers__ai_provider__get)
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

[Document link](https://developer.mantiumai.com/reference#get_ai_engine_by_name_v1_ai_engine_get_name__name__get)
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

[Document link](https://developer.mantiumai.com/reference#list_tags_v1_tag__get)

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

[Document link](https://developer.mantiumai.com/reference#post_tag_v1_tag__post)
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

[Document link](https://developer.mantiumai.com/reference#get_tag_v1_tag_id__tag_id__get)
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
  await mantiumAi.Tags().retrieveId('some-long-id').then((response) => {
    console.log('*********** Tag retrieve by id *********');
    console.log(response.data);
  });
})();
```
#### Example of a successful completion response
```js
// *********** Tag retrieve by id *********
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

[Document link](https://developer.mantiumai.com/reference#get_tag_v1_tag__tag_id__get)
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
  await mantiumAi.Tags().retrieve('some-long-id').then((response) => {
    console.log('*********** Tag retrieve *********');
    console.log(response.data);
  });
})();
```

#### Example of a successful completion response
```js
*********** Tag retrieve *********
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
[Document link](https://developer.mantiumai.com/reference#patch_tag_v1_tag__tag_id__patch)
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
[Document link](https://developer.mantiumai.com/reference#delete_tag_v1_tag__tag_id__delete)
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

### Prompts

#### List Prompts

List all of your organization's prompts.

Query String Parameters

- page - The page of records to return. Optional, defaults to page 1.
- size - the number of records to return for each page. Optional, defaults to 20 - prompts a page.
- schema_class - not used, exclude.
- tags - A list of Tag IDs separated by comma used to filter the results, optional.

[Document link](https://developer.mantiumai.com/reference#list_prompts_v1_prompt__get)

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
    return response;
  });

  await mantiumAi.Prompts().list({ 'page': 1, 'size': 20, 'show_public_shareable': false }).then((response) => {
    console.log('*********** List *********');
    console.log(response.data);
  });
})();
```

#### Example of a successful completion response
```js
{
  data: [
    {
      id: 'some-long-id',
      type: 'prompt',
      attributes: {
        prompt_id: 'some-long-id',
        organization_id: 'organization-some-long-id',
        name: 'Basic Prompt',
        description: 'Basic Prompt Description',
        created_at: '2021-09-29T02:54:28.543648+00:00',
        prompt_text: 'Endpoint Settings: Prompt Line',
        share_scope: 'ORGANIZATION_ONLY',
        ai_provider_approved: false,
        adults_only: false,
        ai_method: 'completion',
        ai_provider: 'OpenAI',
        intelets: [

        ],
        default_engine: 'ada',
        status: 'ACTIVE',
        prompt_parameters: [
          {
            prompt_text: 'Endpoint Settings: Prompt Line',
            basic_settings: {
              top_p: '1',
              stop_seq: [
                'Basic Settings: Stop Sequence'
              ],
              max_tokens: '1024',
              temperature: '1',
              presence_penalty: '1',
              frequency_penalty: '1'
            },
            default_engine: 'ada',
            advanced_settings: {
              n: '1',
              echo: true,
              stream: true,
              best_of: '10',
              logprobs: '10',
              logit_bias: [

              ]
            }
          }
        ],
        last_activity: null,
        share_name: null,
        share_description: '',
        share_placeholder: '',
        share_author_name: null,
        share_author_contact: '',
        share_type: null,
        share_allow_input: false,
        share_status: 'ACTIVE'
      },
      relationships: {
        intelets: { data: [ ] },
        tags: {
          data: [
            {
              type: 'tag',
              id: 'tag-some-long-id'
            }
          ]
        },
        security_policies: { data: [ ] },
        prompt_policies: { data: [ ] }
      }
    }
  ],
  included: [
    {
      id: 'tag-some-long-id',
      type: 'tag',
      attributes: [
        { tag_id: 'tag-some-long-id', name: 'Basic Tag' }
      ],
      relationships: {

      }
    }
  ],
  meta: {

  },
  links: {
    total_items: 3,
    current_page: 1
  }
}

```
[Go to Table of Contents](#table-of-contents)

#### Create a Prompt

Body payload

`object` { ...data }; [Object example](https://developer.mantiumai.com/reference#add_prompt_v1_prompt__post)

[Document link](https://developer.mantiumai.com/reference#add_prompt_v1_prompt__post)

##### Example of violate setting value(s) and it's Response(s)

in following example we send number beyond the number range
`prompt_parameters.advanced_settings.n = 10`
this value should between 1 - 3


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
    return response;
  });

  mantiumAi.Prompts('OpenAI').create({
    "name": "create the Prompt",
    "intelets": [],
    "policies": [],
    "tags": ["tag-some-long-id"],
    "status": "ACTIVE",
    "description": "Basic Prompt Description",
    "prompt_text": "Endpoint Settings: Prompt Line",
    "ai_method": "completion",
    "default_engine": "ada",
    "prompt_parameters": {
      "basic_settings": {
        "temperature": "1",
        "max_tokens": "512",
        "frequency_penalty": "1",
        "presence_penalty": "1",
        "top_p": "1",
        "stop_seq": ["Basic Settings: Stop Sequence"]
      },
      "advanced_settings": {
        "best_of": "5",
        "n": "10",
        "logprobs": "10",
        "echo": true,
        "stream": true,
        "logit_bias": []
      }
    }
  }).then((response) => {
    console.log("*************** Prompt Create ***************");
    console.log(response.detail);
  });
})();
```
##### Example of a Error response
```js
// *************** Prompt Create ***************
{
  detail: [
    {
      loc: [ 'body', 'prompt_parameters', 'advanced_settings', 'n' ],
      msg: 'ensure this value is less than or equal to 3',
      type: 'value_error.number.not_le',
      ctx: { limit_value: 3 }
    }
  ]
}

```

#### Example of a successful completion response

```js
// *************** Prompt Create ***************
{
  data: {
    id: 'some-long-id',
    type: 'prompt',
    attributes: {
      prompt_id: 'some-long-id',
      organization_id: 'organization-some-long-id',
      name: 'create the Prompt',
      description: 'Basic Prompt Description',
      created_at: '2021-10-10T15:28:29.026463+00:00',
      prompt_text: 'Endpoint Settings: Prompt Line',
      share_scope: 'ORGANIZATION_ONLY',
      ai_provider_approved: false,
      adults_only: false,
      ai_method: 'completion',
      ai_provider: 'OpenAI',
      default_engine: 'ada',
      status: 'ACTIVE',
      prompt_parameters: [Object],
      last_activity: null,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_allow_input: false,
      share_status: 'ACTIVE'
    },
    relationships: {
      intelets: [Object],
      tags: [Object],
      security_policies: [Object],
      prompt_policies: [Object]
    }
  },
  included: [
    {
      id: 'tag-some-long-id',
      type: 'tag',
      attributes: [Object],
      relationships: {}
    }
  ],
  meta: {},
  links: {}
}
```

[Go to Table of Contents](#table-of-contents)

#### Update Prompt

Update details about a specific Prompt.

Prompt Id* (string)* required parameter

Body payload `object` { ...data }; [Object example](https://developer.mantiumai.com/reference#edit_prompt_v1_prompt__prompt_id__patch)

[Document link](https://developer.mantiumai.com/reference#edit_prompt_v1_prompt__prompt_id__patch)

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
      // console.log(response);
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  mantiumAi.Prompts('OpenAI').update({
    "id": "some-long-id",
    "name": "update the Prompt",
    "intelets": [],
    "policies": [],
    "tags": ["383fb5e6-6c30-4641-9850-efeb3cdd77b8"],
    "status": "ACTIVE",
    "description": "Basic Prompt Description",
    "prompt_text": "Endpoint Settings: Prompt Line",
    "ai_method": "completion",
    "default_engine": "ada",
    "prompt_parameters": {
      "basic_settings": {
        "temperature": "1",
        "max_tokens": "512",
        "frequency_penalty": "1",
        "presence_penalty": "1",
        "top_p": "1",
        "stop_seq": ["Basic Settings: Stop Sequence"]
      },
      "advanced_settings": {
        "best_of": "5",
        "n": "2",
        "logprobs": "10",
        "echo": true,
        "stream": true,
        "logit_bias": []
      }
    }
  }).then((response) => {
    console.log("*************** Prompt Update ***************");
    console.log(response);
  });

})();

```

#### Example of a successful completion response

```js
// *************** Prompt Update ***************
{
  data: {
    id: 'some-long-id',
    type: 'prompt',
    attributes: {
      prompt_id: 'some-long-id',
      organization_id: 'organization-some-long-id',
      name: 'update the Prompt',
      description: 'Basic Prompt Description',
      created_at: '2021-10-10T15:28:29.026463+00:00',
      prompt_text: 'Endpoint Settings: Prompt Line',
      share_scope: 'ORGANIZATION_ONLY',
      ai_provider_approved: false,
      adults_only: false,
      ai_method: 'completion',
      ai_provider: 'OpenAI',
      default_engine: 'ada',
      status: 'ACTIVE',
      prompt_parameters: {
        basic_settings: {
          top_p: '1',
          stop_seq: [Array],
          max_tokens: '512',
          temperature: '1',
          presence_penalty: '1',
          frequency_penalty: '1'
        },
        advanced_settings: {
          n: '2',
          echo: true,
          stream: true,
          best_of: '5',
          logprobs: '10',
          logit_bias: []
        }
      },
      last_activity: null,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_allow_input: false,
      share_status: 'ACTIVE'
    },
    relationships: {
      intelets: { data: [] },
      tags: { data: [ [Object] ] },
      security_policies: { data: [] },
      prompt_policies: { data: [] }
    }
  },
  included: [
    {
      id: 'tag-some-long-id',
      type: 'tag',
      attributes: {
        tag_id: 'tag-some-long-id',
        name: 'Basic Tag'
      },
      relationships: {}
    }
  ],
  meta: {},
  links: {}
}
```

[Go to Table of Contents](#table-of-contents)


#### Get Prompt using ID url
Get details about a specific Prompt.

Prompt Id* (string)* required parameter

[Document link](https://developer.mantiumai.com/reference#show_prompt_by_id_v1_prompt_id__prompt_id__get)

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
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  await mantiumAi.Prompts()
    .retreiveId('fab6e007-dab2-4245-907e-e1edf6f5f690')
    .then((response) => {
      console.log("*************** Retreive ***************");
      console.log(response);
    });
})();
```

#### Example of a successful completion response
```js
{
  data: {
    id: 'fab6e007-dab2-4245-907e-e1edf6f5f690',
    type: 'prompt',
    attributes: {
      prompt_id: 'fab6e007-dab2-4245-907e-e1edf6f5f690',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      name: 'update the Prompt',
      description: 'Basic Prompt Description',
      created_at: '2021-10-10T15:28:29.026463+00:00',
      prompt_text: 'Endpoint Settings: Prompt Line',
      share_scope: 'ORGANIZATION_ONLY',
      ai_provider_approved: false,
      adults_only: false,
      ai_method: 'completion',
      ai_provider: 'OpenAI',
      default_engine: 'ada',
      status: 'ACTIVE',
      prompt_parameters: {
        basic_settings: {
          top_p: '1',
          stop_seq: [Array],
          max_tokens: '512',
          temperature: '1',
          presence_penalty: '1',
          frequency_penalty: '1'
        },
        advanced_settings: {
          n: '2',
          echo: true,
          stream: true,
          best_of: '5',
          logprobs: '10',
          logit_bias: []
        }
      },
      last_activity: null,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_allow_input: false,
      share_status: 'ACTIVE'
    },
    relationships: {
      intelets: { data: [] },
      tags: { data: [ [Object] ] },
      security_policies: { data: [] },
      prompt_policies: { data: [] }
    }
  },
  included: [
    {
      id: '383fb5e6-6c30-4641-9850-efeb3cdd77b8',
      type: 'tag',
      attributes: {
        tag_id: '383fb5e6-6c30-4641-9850-efeb3cdd77b8',
        name: 'Basic Tag'
      },
      relationships: {}
    }
  ],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


#### Get Prompt
Get details about a specific Prompt.

Prompt Id* (string)* required parameter

[Document link](https://developer.mantiumai.com/reference#show_prompt_by_id_v1_prompt__prompt_id__get)
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
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  await mantiumAi.Prompts()
    .retreive('fab6e007-dab2-4245-907e-e1edf6f5f690')
    .then((response) => {
      console.log("*************** Retreive ***************");
      console.log(response);
    });
})();
```

#### Example of a successful completion response
```js
{
  data: {
    id: 'fab6e007-dab2-4245-907e-e1edf6f5f690',
    type: 'prompt',
    attributes: {
      prompt_id: 'fab6e007-dab2-4245-907e-e1edf6f5f690',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      name: 'update the Prompt',
      description: 'Basic Prompt Description',
      created_at: '2021-10-10T15:28:29.026463+00:00',
      prompt_text: 'Endpoint Settings: Prompt Line',
      share_scope: 'ORGANIZATION_ONLY',
      ai_provider_approved: false,
      adults_only: false,
      ai_method: 'completion',
      ai_provider: 'OpenAI',
      default_engine: 'ada',
      status: 'ACTIVE',
      prompt_parameters: {
        basic_settings: {
          top_p: '1',
          stop_seq: [Array],
          max_tokens: '512',
          temperature: '1',
          presence_penalty: '1',
          frequency_penalty: '1'
        },
        advanced_settings: {
          n: '2',
          echo: true,
          stream: true,
          best_of: '5',
          logprobs: '10',
          logit_bias: []
        }
      },
      last_activity: null,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_allow_input: false,
      share_status: 'ACTIVE'
    },
    relationships: {
      intelets: { data: [] },
      tags: { data: [ [Object] ] },
      security_policies: { data: [] },
      prompt_policies: { data: [] }
    }
  },
  included: [
    {
      id: '383fb5e6-6c30-4641-9850-efeb3cdd77b8',
      type: 'tag',
      attributes: {
        tag_id: '383fb5e6-6c30-4641-9850-efeb3cdd77b8',
        name: 'Basic Tag'
      },
      relationships: {}
    }
  ],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


#### Delete Prompt

Delete a specific Prompt.

Prompt Id* (string)* required parameter

[Document link](https://developer.mantiumai.com/reference#delete_prompt_v1_prompt__prompt_id__delete)

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
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
  await mantiumAi.Prompts()
    .remove('fab6e007-dab2-4245-907e-e1edf6f5f690')
    .then((response) => {
      console.log("*************** Remove ***************");
      console.log(response);
    });
})();

/*
* run command
* node prompt/retreive.js
*/

```

#### Example of a successful completion response
```js
{}
```
[Go to Table of Contents](#table-of-contents)


#### Execute Prompt

Asynchronously submit a prompt by prompt_id. If successful, the status and results of the prompt can be retrieved
from the /v1/prompt/result/{prompt_execution_id} endpoint by prompt_execution_id.

Prompt Id* (string)* required parameter

Input* (string)* Input for executing a prompt asynchronously

[Document link](https://developer.mantiumai.com/reference#execute_prompt_v1_prompt__prompt_id__execute_post)

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
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */

  let prompt_id = 'b1c01f1a-ff6c-45e8-8378-d23d11d7de9c';
  let input = 'This is my first test execute prompt';

  await mantiumAi.Prompts('OpenAI')
    .execute({
      id: prompt_id,
      input
    })
    .then(async (res) => {
      console.log("*************** Execute ***************");
      console.log(res);
    });
})();
```

#### Example of a successful completion response
```js
// *************** Execute ***************
{
  success: true,
  prompt_id: 'b1c01f1a-ff6c-45e8-8378-d23d11d7de9c',
  input: 'This is my first test execute prompt',
  status: 'QUEUED',
  prompt_execution_id: 'd96d6f42-05a3-4ae6-b846-a891af8a8635',
  error: '',
  warning_message: ''
}
```
[Go to Table of Contents](#table-of-contents)


#### Get Prompt Result

Returns execution status of a prompt ran through the prompt execution workflow asynchronously.

Prompt Execution Id* (string)* this can be achieved from the successful response from the execute prompt method.

[Document link](https://developer.mantiumai.com/reference#get_prompt_result_v1_prompt_result__prompt_execution_id__get)

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
      return response;
    });

  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */

  let prompt_id = 'b1c01f1a-ff6c-45e8-8378-d23d11d7de9c';
  let input = 'This is my second test execute prompt';

  await mantiumAi.Prompts('OpenAI')
    .execute({
      id: prompt_id,
      input
    })
    .then(async (res) => {
      /*
      * from the successful response collect the prompt_execution_id
      * and then pass this to the result method
      */
      if(res?.prompt_execution_id) {
        await mantiumAi.Prompts('OpenAI').result(res.prompt_execution_id)
        .then((response) => {
          console.log("*************** Execute Result ***************");
          console.log(response);
        });
      }
    });
})();
```

#### Example of a successful completion response
```js
// *************** Execute Result ***************
{
  prompt_execution_id: 'd96d6f42-05a3-4ae6-b846-a891af8a8635',
  prompt_id: 'b1c01f1a-ff6c-45e8-8378-d23d11d7de9c',
  status: 'COMPLETED',
  input: 'This is my second test execute prompt',
  output: "Endpoint Settings: Prompt LineThis is my second test execute prompt, but my last one worked fine. I thought this was rough except for Thoughtnet having doubts about working with it... I found another test which showed interaction with the NavigatorHelpers class. But, now my memory is terrible. Part of that may be hardware ghosting or at least faulty programming on bad servers.....I tried to use InsertPageName here only to find that didn't work though. So, if extra query pages fail because not everything's Showed in Page Name window, something cleantly isn't done.... Now the question is whether Thoughtnet will comply so they don't have to deal w/ weird loading times?????Edit: You can go straight off After powering up after this screen appearsoted by Admin using Command Prompt",
  error: '',
  reason: '',
  hitl_info: null,
  warning_message: ''
}
```
[Go to Table of Contents](#table-of-contents)
