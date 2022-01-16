
<h3 align="center">Mantium</h3>

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Quickstart:](#quickstart)
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
    - [Get AI Engines By Provider](#get-ai-engines-by-provider)
    - [Get AI Engine By Name](#get-ai-engine-by-name)
  - [Tags](#tags)
    - [List Tags](#list-tags)
    - [Create a Tag](#create-a-tag)
    - [Get Tag using ID url](#get-tag-using-id-url)
    - [Get Tag](#get-tag)
    - [Update Tag](#update-tag)
    - [Delete Tag](#delete-tag)
  - [Prompts](#prompts)
    - [List Prompts](#list-prompts)
    - [Create a Prompt](#create-a-prompt)
    - [Update Prompt](#update-prompt)
    - [Get Prompt using ID url](#get-prompt-using-id-url)
    - [Get Prompt](#get-prompt)
    - [Delete Prompt](#delete-prompt)
    - [Execute Prompt](#execute-prompt)
    - [Get Prompt Result](#get-prompt-result)
  - [Logs](#logs)
    - [List Logs](#list-logs)
    - [Get Log using ID url](#get-log-using-id-url)
    - [Get Log](#get-log)
  - [Intelets](#intelets)
    - [List Intelets](#list-intelets)
    - [Create an Intelet](#create-an-intelet)
    - [Correct data for creation](#correct-data-for-creation)
    - [Update Intelet](#update-intelet)
    - [Get an Intelet using ID url](#get-an-intelet-using-id-url)
    - [Get an Intelet](#get-an-intelet)
    - [Delete an Intelet](#delete-an-intelet)
    - [Execute Intelet](#execute-intelet)
    - [Get Intelet Result](#get-intelet-result)
    - [Health](#health)
  - [Files](#files)
    - [List Files](#list-files)
    - [upload a File](#upload-a-file)
    - [Delete File](#delete-file)
  - [security](#security)
    - [Create Policy](#create-policy)
    - [Update Policy](#update-policy)
    - [Remove Policy](#remove-policy)
    - [List Policies](#list-policies)
    - [Get policy](#get-policy)
    - [Get policy using ID url](#get-policy-using-id-url)
    - [List Rules](#list-rules)
    - [Get rule](#get-rule)
    - [Get rule using ID url](#get-rule-using-id-url)
    - [List Action Types](#list-action-types)
    - [Get Action Type](#get-action-type)
    - [Get Action Type using ID url](#get-action-type-using-id-url)
## Quickstart:

Read the [getting started guide](https://developer.mantiumai.com/docs) for more information on how to use Mantium.

## Authentication

- Make an account by visiting [app.mantiumai.com](https://app.mantiumai.com) and select Register.
- Enter your email address and create a password. After you've verified the email, you'll be able to sign in to the Mantium application. You'll also need your username and password to obtain a token for API use.

## Installation

Install [Node.js](https://nodejs.org/en/) on your computer. To install JavaScript Library please use the following command.

```js
  npm install @mantium/mantiumapi
```

## Usage

### Initializing
```js
  const mantiumAi = require('@mantium/mantiumapi');

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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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
#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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

const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response

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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response

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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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


const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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
const mantiumAi = require('@mantium/mantiumapi');

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

#### Example of a successful API response
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

### Logs

#### List Logs

Query Params

`page` (number) - Page number

`size` (number) - Page size. If not supplied, returns all the results in a single page for certain APIs.

`after_date` (string) - After Date

`before_date` (string) Before Date

`log_type` (string) LogType, An enumeration. [AUTH | DEFAULT | PROMPT | INTELET FILE]

`log_level` (string) Log Level

`log_status` (string) Log Status


[Document link](https://developer.mantiumai.com/reference#list_logs_v1_log__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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

  await mantiumAi.Logs().list({
      'page': 1,
      'size': 2
    })
    .then((response) => {
      console.log('*********** Logs list *********');
      console.log(response);
    });
})();
```

#### Example of a successful API response
```js
// *********** Logs list *********
{
  data: [
    {
      id: 'log-some-long-id',
      type: 'log',
      attributes: {
        log_id: 'log-some-long-id',
        event_timestamp: '2021-10-15T13:55:57.468749+00:00',
        organization_id: 'organization-some-long-id',
        log_type: 'PROMPT',
        log_payload: [Object],
        log_level: 'INFO'
      },
      relationships: {}
    },
    {
      id: 'log-some-long-id',
      type: 'log',
      attributes: {
        log_id: 'log-some-long-id',
        event_timestamp: '2021-10-15T13:55:52.304732+00:00',
        organization_id: 'organization-some-long-id',
        log_type: 'PROMPT',
        log_payload: [Object],
        log_level: 'WARNING'
      },
      relationships: {}
    }
  ],
  included: [],
  meta: {},
  links: { total_items: 103, current_page: 1, next_page: 2 }
}
```
[Go to Table of Contents](#table-of-contents)


#### Get Log using ID url

Get details about a specific log.

Prompt Id* (string)* required parameter

[Document link](https://developer.mantiumai.com/reference#get_log_v1_log_id__log_id__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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

  await mantiumAi.Logs().retrieveId('log-some-long-id')
    .then((response) => {
      console.log('*********** Log *********');
      console.log(response);
    });
})();
```

#### Example of a successful API response

```js
{
  data: {
    id: 'bb65e751-9384-4239-a9e9-a29703e94de4',
    type: 'log',
    attributes: {
      log_id: 'bb65e751-9384-4239-a9e9-a29703e94de4',
      event_timestamp: '2021-10-15T13:55:57.468749+00:00',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      log_type: 'PROMPT',
      log_payload: {
        to: 'completion',
        name: 'update the Prompt',
        error: '',
        input: 'This is my testing execute prompt',
        config: [Object],
        output: '. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test.\n' +
          'I have a new prompt line that I want to test.',
        status: 'COMPLETED',
        ai_app_id: null,
        ai_method: 'completion',
        direction: 'incoming',
        prompt_id: '29d46e2b-9d43-42cf-a1b0-edbf5db745dc',
        intelet_id: null,
        ai_provider: 'OpenAI',
        prompt_text: 'Updated new Prompt Line',
        warning_message: null,
        provider_response: [Object],
        input_character_length: 56
      },
      log_level: 'INFO'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```

[Go to Table of Contents](#table-of-contents)


#### Get Log

Get details about a specific log.

Prompt Id* (string)* required parameter

[Document link](https://developer.mantiumai.com/reference#get_log_v1_log__log_id__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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

  await mantiumAi.Logs().retrieveId('log-some-long-id')
    .then((response) => {
      console.log('*********** Log *********');
      console.log(response);
    });
})();
```

#### Example of a successful API response

```js
{
  data: {
    id: 'bb65e751-9384-4239-a9e9-a29703e94de4',
    type: 'log',
    attributes: {
      log_id: 'bb65e751-9384-4239-a9e9-a29703e94de4',
      event_timestamp: '2021-10-15T13:55:57.468749+00:00',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      log_type: 'PROMPT',
      log_payload: {
        to: 'completion',
        name: 'update the Prompt',
        error: '',
        input: 'This is my testing execute prompt',
        config: [Object],
        output: '. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test. I have a new prompt line that I want to test.\n' +
          'I have a new prompt line that I want to test.',
        status: 'COMPLETED',
        ai_app_id: null,
        ai_method: 'completion',
        direction: 'incoming',
        prompt_id: '29d46e2b-9d43-42cf-a1b0-edbf5db745dc',
        intelet_id: null,
        ai_provider: 'OpenAI',
        prompt_text: 'Updated new Prompt Line',
        warning_message: null,
        provider_response: [Object],
        input_character_length: 56
      },
      log_level: 'INFO'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```

[Go to Table of Contents](#table-of-contents)


### Intelets

#### List Intelets

List all of your organization's intelets.

Query String Parameters

- page (number) - The page of records to return. Optional, defaults to page 1.

- size (number) - the number of records to return for each page. Optional, defaults to 20 intelets a page.

- tags (string) - A list of Tag IDs separated by comma used to filter the results, optional.

[Document link](https://developer.mantiumai.com/reference#list_intelets_v1_intelet__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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
  await mantiumAi.Intelets().list({ 'page': 1, 'size': 20 }).then((response) => {
    console.log('*********** List *********');
    console.log(response.data);
  });
})();

```

#### Example of a successful API response
```js
{
  data: [
    {
      id: 'f6e84a80-5c60-4015-90e8-21fe0b0fc8b7',
      type: 'intelet_view',
      attributes: {
        intelet_id: 'f6e84a80-5c60-4015-90e8-21fe0b0fc8b7',
        name: 'Intelet Name given by me',
        description: 'Description given by me',
        created_at: '2021-10-17T10:44:14.510931+00:00',
        created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
        created_by_email: 'kedman1234@gmail.com',
        created_by_name: ' ',
        updated_at: null,
        updated_by_email: null,
        updated_by_name: null,
        organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
        organization_name: ' ',
        tags: null,
        prompts: [
          {
            prompt_id: 'c45bcc94-ea1e-4faa-886b-059b10c38020',
            prompt_name: 'update the Prompt',
            operation_order: 1
          },
          {
            prompt_id: '242bb0a2-213e-4001-96a4-f29e0912c99a',
            prompt_name: 'Basic Prompt',
            operation_order: 2
          }
        ]
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

#### Create an Intelet

- Name* (string) - Name of the Intelet.

- Description (string) - Text to describe the purpose of this Intelet.

- Prompts (array) - Prompts to include in the Intelet. Prompts are executed in the order that they appear in this list, with the first Prompt feeding its output to the 2nd Prompt, and so on until the final Prompt.

Body payload `object` { ...data }; [Object example](https://developer.mantiumai.com/reference#create_intelet_v1_intelet__post)


[Document link](https://developer.mantiumai.com/reference#create_intelet_v1_intelet__post)


##### Example of violate setting value(s) and it's Response(s)

in following example we send wrong prompts ID's


```js
const mantiumAi = require('@mantium/mantiumapi');

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
  mantiumAi.Intelets('OpenAI').create({
    "name":"intelet name",
    "description":"description for the intelet",
    "prompts":[
      "41f62edf-9b0f-4397-8254-21dfc95e4efe",
      "23c217b8-1f87-4222-9e3c-e3bf4497c217"
    ]}).then((response) => {
    console.log("*************** Intelet Create ***************");
    console.log(response);
  });

})();
```



##### Example of a Error response
```js
// *************** Prompt Create ***************
{
  detail: 'Prompt ID 96613f72-0fed-4b39-8775-beafe74d30ef does not exist for the organization 563821cd-903e-4b5c-8541-ea828058aec6'
}

```

#### Correct data for creation
```js
const mantiumAi = require('@mantium/mantiumapi');

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
  mantiumAi.Intelets('OpenAI').create({
    "name":"intelet name",
    "description":"description for the intelet",
    "prompts":[
      "41f62edf-9b0f-4397-8254-21dfc95e4efe",
      "23c217b8-1f87-4222-9e3c-e3bf4497c217"
    ]}).then((response) => {
    console.log("*************** Intelet Create ***************");
    console.log(response);
  });
})();
```

#### Example of a successful API response
```js
{
  data: {
    id: '8caa02c8-cb62-4a58-a17c-302a8369b3a0',
    type: 'intelet',
    attributes: {
      created_at: '2021-10-17T17:18:39.618524+00:00',
      updated_at: null,
      intelet_id: '8caa02c8-cb62-4a58-a17c-302a8369b3a0',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      name: 'intelet name',
      description: 'description for the intelet',
      share_allow_input: false,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_status: 'ACTIVE',
      created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      updated_by: null
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Update Intelet


- Name* (string) - Name of the Intelet.

- Description (string) - Text to describe the purpose of this Intelet.

- Prompts (array) - Prompts to include in the Intelet. Prompts are executed in the order that they appear in this list, with the first Prompt feeding its output to the 2nd Prompt, and so on until the final Prompt.


Prompt Id* (string)* required parameter

Body payload `object` { ...data }; [Object example](https://developer.mantiumai.com/reference#edit_intelet_v1_intelet__intelet_id__patch)

[Document link](https://link)

```js
const mantiumAi = require('@mantium/mantiumapi');

// mantiumAi.ORIGIN = 'https://api.staging.mantiumai.com';

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
  mantiumAi.Intelets().update({
    "id": "5407866a-0ad3-4671-b7e3-b5635bf521ea",
    "name":"Chang in intelet name",
    "description":"description for the intelet is changed",
    "prompts":[
      "41f62edf-9b0f-4397-8254-21dfc95e4efe",
      "23c217b8-1f87-4222-9e3c-e3bf4497c217"
    ]}).then((response) => {
    console.log("*************** Intelet update ***************");
    console.log(response);
  });

})();
```

#### Example of a successful API response
```js
// *************** Intelet Update ***************
{
  data: {
    id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
    type: 'intelet',
    attributes: {
      created_at: '2021-10-18T10:25:08.034662+00:00',
      updated_at: '2021-10-18T10:42:57.048906+00:00',
      intelet_id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      name: 'Chang in intelet name',
      description: 'description for the intelet is changed',
      share_allow_input: false,
      share_name: null,
      share_description: '',
      share_placeholder: '',
      share_author_name: null,
      share_author_contact: '',
      share_type: null,
      share_status: 'ACTIVE',
      created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      updated_by: 'a3e5c076-311c-46af-97cd-d1e529512afe'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


#### Get an Intelet using ID url

Information on specific intelet

- Intelet Id* (string)

[Document link](https://developer.mantiumai.com/reference#show_intelet_by_id_v1_intelet_id__intelet_id__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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
  await mantiumAi.Intelets()
    .retrieveId('5407866a-0ad3-4671-b7e3-b5635bf521ea')
    .then((response) => {
      console.log("*************** retrieve ***************");
      console.log(response);
    });
})();
```

#### Example of a successful API response
```js
// *************** retrieve ***************
{
  data: {
    id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
    type: 'intelet_view',
    attributes: {
      intelet_id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
      name: 'Chang in intelet name',
      description: 'description for the intelet is changed',
      created_at: '2021-10-18T10:25:08.034662+00:00',
      created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      created_by_email: 'kedman1234@gmail.com',
      created_by_name: ' ',
      updated_at: '2021-10-18T10:42:57.048906+00:00',
      updated_by_email: 'kedman1234@gmail.com',
      updated_by_name: ' ',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      organization_name: ' ',
      tags: null,
      prompts: [
        {
          prompt_id: 'c07449be-aae0-421c-a00d-72e1b6928ac4',
          prompt_name: 'update the Prompt',
          operation_order: 1
        },
        {
          prompt_id: 'fb6a24b9-cd3c-4600-a58f-929ce6d5c044',
          prompt_name: 'Test prompt name',
          operation_order: 2
        }
      ]
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


#### Get an Intelet

Information on specific intelet

- Intelet Id* (string)

[Document link](https://developer.mantiumai.com/reference#show_intelet_by_id_v1_intelet_id__intelet_id__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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
  await mantiumAi.Intelets()
    .retrieve('5407866a-0ad3-4671-b7e3-b5635bf521ea')
    .then((response) => {
      console.log("*************** retrieve ***************");
      console.log(response);
    });
})();
```

#### Example of a successful API response
```js
// *************** retrieve ***************
{
  data: {
    id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
    type: 'intelet_view',
    attributes: {
      intelet_id: '5407866a-0ad3-4671-b7e3-b5635bf521ea',
      name: 'Chang in intelet name',
      description: 'description for the intelet is changed',
      created_at: '2021-10-18T10:25:08.034662+00:00',
      created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      created_by_email: 'kedman1234@gmail.com',
      created_by_name: ' ',
      updated_at: '2021-10-18T10:42:57.048906+00:00',
      updated_by_email: 'kedman1234@gmail.com',
      updated_by_name: ' ',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      organization_name: ' ',
      tags: null,
      prompts: [
        {
          prompt_id: 'c07449be-aae0-421c-a00d-72e1b6928ac4',
          prompt_name: 'update the Prompt',
          operation_order: 1
        },
        {
          prompt_id: 'fb6a24b9-cd3c-4600-a58f-929ce6d5c044',
          prompt_name: 'Test prompt name',
          operation_order: 2
        }
      ]
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)




#### Delete an Intelet

- Intelet Id* (string)

[Document link](https://developer.mantiumai.com/reference#delete_intelet_v1_intelet__intelet_id__delete)

```js


const mantiumAi = require('@mantium/mantiumapi');

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
  await mantiumAi.Intelets()
    .remove('2bddef3e-f4d9-400c-b2db-4ed2a52c6b83')
    .then((response) => {
      console.log("*************** Remove ***************");
      console.log(response);
    });
})();

/*
* run command
* node intelets/remove.js
*/

```

#### Example of a successful API response
```js
Intelet Deleted
```
[Go to Table of Contents](#table-of-contents)


#### Execute Intelet

Asynchronously submit data to an intelet by intelet_id. If successful, the status and results of the intelet can be retrieved from the /v1/intelet/result/{intelet_execution_id} endpoint by intelet_execution_id.

Intelet Id* (string)* required parameter, The ID of the intelet to start executing

Input* (string)* Data to input into the Intelet

[Document link](https://developer.mantiumai.com/reference#execute_intelet_v1_intelet__intelet_id__execute_post)

```js
const mantiumAi = require('@mantium/mantiumapi');

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

  let intelet_id = 'some-long-intelets-id';
  let input = 'What is the meaning of life?';

  await mantiumAi.Intelets()
    .execute({
      id: intelet_id,
      input
    })
    .then(async (res) => {
      console.log("*************** Execute ***************");
      console.log(res);
    });
})();
```

#### Example of a successful API response
```js
// *************** Execute ***************
{
  success: true,
  intelet_id: 'some-long-intelets-id',
  input: 'What is the meaning of life?',
  status: 'QUEUED',
  intelet_execution_id: 'some-long-intelets-execution-id',
  error: ''
}
```
[Go to Table of Contents](#table-of-contents)


#### Get Intelet Result

Get Intelet Execution Result

Returns execution status of intelet ran through the intelet execution workflow asynchronously.

Intelet Execution Id* (string)* this can be achieved from the successful response from the execute Intelet method.

[Document link](https://developer.mantiumai.com/reference#get_intelet_execution_result_v1_intelet_result__intelet_execution_id__get)

```js
const mantiumAi = require('@mantium/mantiumapi');

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

  let intelet_id = 'some-long-intelets-id';
  let input = 'What is the meaning of life?';

  await mantiumAi.Intelets()
    .execute({
      id: intelet_id,
      input
    })
    .then(async (res) => {
      /*
      * from the successful response collect the prompt_execution_id
      * and then pass this to the result method
      */
      if(res?.intelet_execution_id) {
        await mantiumAi.Intelets().result(res.intelet_execution_id)
        .then((response) => {
          console.log("*************** Execute Result ***************");
          console.log(response);
        });
      }
    });
})();
```

#### Example of a successful API response
```js
// *************** Execute Result ***************
{
  intelet_execution_id: '81daa784-838f-46f6-9518-2c50cec7fb4b',
  intelet_id: 'da98c9fc-c139-4136-a6e9-286bca5cc397',
  status: 'COMPLETED',
  input: 'What is the meaning of life?',
  output: '\n' +
    '"I am a man of the people, and I will not be a slave to the people." - Abraham Lincoln\n' +
    '\n',
  error: '',
  reason: '',
  results: [],
  pending_prompts: [],
  executed_prompts: [
    {
      status: 'COMPLETED',
      prompt_execution_id: '4e72c6a3-3560-410c-af5f-fe5544d5b986',
      prompt_id: '41f62edf-9b0f-4397-8254-21dfc95e4efe',
      input: 'What is the meaning of life?',
      output: '\n' +
        'Check out my FULL explanation, including copyright claim for this work at the bottom of the OP.\n' +
        "Well is it absolutely necessary? I know you like to troll, but if your goal is information sharing (and not trolling) is there any point in starting with negativity? Or am I missing something that using fault finding opens up exept personal gratification on your part..OH PS IM NOT A TANK!!!! Well many people may respond 'TKO's SILLY' Check out my FULL explanation, including copyright claim for this work at the bottom of the OP.Well is it absolutely necessary? I know you like to troll, but if your goal is information sharing (and not trolling)is there any point in starting with negativity? Or am I missing something that using fault finding opens up exept personal gratification on your part..OH PS IM NOT A TANK!!!!",
      reason: '',
      error: '',
      hitl_info: null
    },
    {
      status: 'COMPLETED',
      prompt_execution_id: '8108d3be-0f12-4d94-bfda-1f49327c6d12',
      prompt_id: '23c217b8-1f87-4222-9e3c-e3bf4497c217',
      input: '\n' +
        'Check out my FULL explanation, including copyright claim for this work at the bottom of the OP.\n' +
        "Well is it absolutely necessary? I know you like to troll, but if your goal is information sharing (and not trolling) is there any point in starting with negativity? Or am I missing something that using fault finding opens up exept personal gratification on your part..OH PS IM NOT A TANK!!!! Well many people may respond 'TKO's SILLY' Check out my FULL explanation, including copyright claim for this work at the bottom of the OP.Well is it absolutely necessary? I know you like to troll, but if your goal is information sharing (and not trolling)is there any point in starting with negativity? Or am I missing something that using fault finding opens up exept personal gratification on your part..OH PS IM NOT A TANK!!!!",
      output: '\n' +
        '"I am a man of the people, and I will not be a slave to the people." - Abraham Lincoln\n' +
        '\n',
      reason: '',
      error: '',
      hitl_info: null
    }
  ]
}
```
[Go to Table of Contents](#table-of-contents)


#### Health

Check the API health.

[Document link](https://developer.mantiumai.com/reference/api_health_health_get)

```js

const mantiumAi = require('@mantium/mantiumapi');

mantiumAi.Health().check().then((response) => {
  console.log("*************** Health response ***************");
  console.log(response);
});
```

#### Example of a successful API response
```js
OK. API Version vX-XXXXXXXX running since YYYY-MM-DDTHH:MM:SS+00:00.
```
[Go to Table of Contents](#table-of-contents)


### Files

#### List Files

Get the list of files currently loaded at OpenAI

Requirements:

QUERY PARAMS

`file_type` (string) 'FILES_ONLY' or 'ALL' or 'FINETUNE_ONLY'

[Document link](https://developer.mantiumai.com/reference/get_files_v1_files_openai_files_get)

```js

const mantiumAi = require('@mantium/mantiumapi');

(async () => {
  await mantiumAi
    .Auth()
    .accessTokenLogin({
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

  await mantiumAi
    .Files()
    .list({ file_type: 'FILES_ONLY' })
    .then((response) => {
      console.log('*********** File list *********');
      console.log(response);
    });
})();


```

#### Example of a successful API response
```js
{
  data: {
    id: 'user-fakpcmfytnzhd7s7uwvzrbms',
    type: 'openai_file',
    attributes: {
      organization: 'user-fakpcmfytnzhd7s7uwvzrbms',
      files: [
        {
          id: 'file-lD7g3egNlil5yyg1RaAkQlmW',
          object: 'file',
          bytes: 1129,
          created_at: 1623106510,
          filename: 'sam2.json',
          purpose: 'answers',
          status: 'processed',
          status_details: null
        },
        {
          id: 'file-MiwAljthEIAh0WnqVKyNm2HU',
          object: 'file',
          bytes: 1128,
          created_at: 1624554610,
          filename: 'blob',
          purpose: 'answers',
          status: 'processed',
          status_details: null
        },
        {
          id: 'file-nkuxoRXPWw6Tl12C0xkheNpb',
          object: 'file',
          bytes: 1131,
          created_at: 1624580768,
          filename: 'blob',
          purpose: 'answers',
          status: 'error',
          status_details: 'Something went wrong while processing. Please contact support@openai.com with the file ID file-nkuxoRXPWw6Tl12C0xkheNpb'
        }
      ],
      size: 3
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}

```
[Go to Table of Contents](#table-of-contents)


#### upload a File

Upload a file to AWS

`key` (string) The AWS key name (or filename)

`purpose` (string) OpenAI file purpose, it could be one of the following `answers`, `classifications` or `search`

`upload_source`* (string)* required parameter - The upload source, which could be one of `OPENAI-FILE-UPLOAD` or `OPENAI-FINETUNING-UPLOAD`

`fine_tune_file_type`  (string) - Could be either `VALIDATION_FILE` or `TRAINING_FILE`

[Document link](https://developer.mantiumai.com/reference/aws_upload_url_v1_files_aws_signature_post)

```js
const mantiumAi = require('@mantium/mantiumapi');
const fs = require('fs');

(async () => {
  await mantiumAi
    .Auth()
    .accessTokenLogin({
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

  await mantiumAi
    .Files()
    .upload({
      purpose: 'Classifications',
      key: fs.createReadStream('./files/classifications_test_file.json'),
      upload_source: 'OPENAI-FILE-UPLOAD',
      fine_tune_file_type: '',
    })
    .then((response) => {
      console.log('*********** Upload response *********');
      console.log(response);
    });
})();

```

#### Example of a successful API response
```js
{
  success: true,
  status: 200,
  error: '',
  warning_message: '',
  upload_source: 'OPENAI-FILE-UPLOAD',
  fine_tune_file_type: '',
  path: './files/classifications_test_file.json',
  purpose: 'Classifications'
}
```
[Go to Table of Contents](#table-of-contents)

#### Delete File

`file_id`* (string)* required parameter - file id to delete

[Document link](https://developer.mantiumai.com/reference/delete_file_v1_files_openai_files__file_id__delete)

```js
const mantiumAi = require('@mantium/mantiumapi');

(async () => {
  await mantiumAi
    .Auth()
    .accessTokenLogin({
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

  await mantiumAi
    .Files()
    .remove('file-lD7g3egNlil5yyg1RaAkQlmW')
    .then((response) => {
      console.log('*********** Remove response *********');
      console.log(response);
    });
})();
```

#### Example of a successful API response
```js
{
  data: {
    id: 'file-lD7g3egNlil5yyg1RaAkQlmW',
    type: 'openai_file',
    attributes: {
      deleted: true,
      file_id: 'file-lD7g3egNlil5yyg1RaAkQlmW',
      object: 'file'
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)


### security  

Security Policies  
You can manage your security policies using these methods.  

#### Create Policy

Create a Security Policy. We only create one policy at a time.  

There is no need to support posting a list of polices at once  

Requirements:  

`name`* (string) required parameter, The name of the security policy.  

`description` (string)  A description of this security policy.  

`rules`  (array) A list of JSON rules objects to attach to the policy.  

`notifications` (array) A list of Notifications to send when any one of the rules are violated.  

`actions` (array) A list of Security Actions to take when any one of the rules are violated.  

[Document link](https://developer.mantiumai.com/reference/post_policy_v1_security_policy_post)

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
 await mantiumAi
    .Security()
    .createPolicy({
      name: 'must be policyname new',
      description: '',
      rules: [
        {
          rule_id: '8bc66446-c72d-4627-a3f4-cf942383cee5',
          parameters: {
            max_input_characters: '2',
            scope: 'per_prompt',
          },
        },
      ],
      actions: [
        {
          action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
        },
        {
          action_type_id: 'a49e30e3-da97-49a1-b501-7840358825ba',
        },
        {
          action_type_id: '72d64ca0-35bf-4646-9782-90634d7b6b97',
        },
      ],
      notifications: [],
    })
    .then((response) => {
      console.log('*********** policy create *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: [
    {
      attributes: {
        created_at: '2022-01-14T15:06:21.705558+00:00',
        updated_at: null,
        policy_id: '7510e70c-c5d8-40b0-b150-0773fccff757',
        organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
        name: 'must be policyname new',
        description: '',
        created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
        updated_by: null,
        rules: [
          {
            rule_id: '8bc66446-c72d-4627-a3f4-cf942383cee5',
            parameters: [Object]
          }
        ],
        actions: [
          {
            action_id: 'e171e6eb-cee2-4fb7-b5bc-ecdb62b2b654',
            action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40'
          },
          {
            action_id: '43f509a8-ec09-4221-a188-59037ddb3409',
            action_type_id: 'a49e30e3-da97-49a1-b501-7840358825ba'
          },
          {
            action_id: '6711d3cf-b877-4445-bdf4-6010b5b78625',
            action_type_id: '72d64ca0-35bf-4646-9782-90634d7b6b97'
          }
        ]
      },
      relationships: { notifications: { data: [] } },
      type: 'security_policy'
    }
  ]
}
```

[Go to Table of Contents](#table-of-contents)

#### Update Policy

Update the existing policy with the contents of the payload  

The UUID in the path is to specify the Security Policy to be updated  

Requirements:  

`id`* (string) required parameter, The policy ID which need to update.  

`name`* (string) required parameter, The name of the security policy.  

`description` (string)  A description of this security policy.  

`rules`  (array) A list of JSON rules objects to attach to the policy.  

`notifications` (array) A list of Notifications to send when any one of the rules are violated.  

`actions` (array) A list of Security Actions to take when any one of the rules are violated.  

[Document link](https://developer.mantiumai.com/reference/patch_policy_v1_security_policy__policy_id__patch)

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
  await mantiumAi
    .Security()
    .updatePolicy({
      id: 'fbf3383d-4349-425e-84ec-e6831318f08b',
      name: 'must be policyname new via update',
      description: 'updated descriptions naav change',
      rules: [
        {
          rule_id: '8bc66446-c72d-4627-a3f4-cf942383cee5',
          parameters: {
            max_input_characters: '2',
            scope: 'per_prompt',
          },
        },
      ],
      actions: [
        {
          action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
        },
        {
          action_type_id: 'a49e30e3-da97-49a1-b501-7840358825ba',
        },
        {
          action_type_id: '72d64ca0-35bf-4646-9782-90634d7b6b97',
        },
      ],
      notifications: [],
    })
    .then((response) => {
      console.log('*********** policy update *********');
      console.log(response);
      console.log(response.data[0].attributes);
      console.log(response.data[0].relationships);
    });
})();
```
#### Example of a successful API response
```js
{
  data: {
    attributes: {
      created_at: '2022-01-15T18:32:20.703771+00:00',
      updated_at: '2022-01-15T19:04:42.606019+00:00',
      policy_id: '73067dc6-44dd-472d-a82b-44e0c3a1ea0a',
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      name: 'must be policyname new via update',
      description: 'updated descriptions naav change',
      created_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      updated_by: 'a3e5c076-311c-46af-97cd-d1e529512afe',
      rules: [Array],
      actions: [Array]
    },
    relationships: { notifications: [Object] },
    type: 'security_policy'
  }
}
```

[Go to Table of Contents](#table-of-contents)
#### Remove Policy

Deletes an existing policy for an organization  

`id`* (string) required parameter, The policy ID

[Document link](https://developer.mantiumai.com/reference/delete_policy_v1_security_policy__policy_id__delete)

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
  await mantiumAi
    .Security()
    .removePolicy('d1851a8b-5735-48be-8fc6-f7aa295df3b4')
    .then((response) => {
      console.log('*********** removePolicy *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  "data": {
    "attributes": {
      "created_at": "2022-01-15T18:31:42.982544+00:00",
      "updated_at": null,
      "policy_id": "d1851a8b-5735-48be-8fc6-f7aa295df3b4",
      "organization_id": "c68c07c9-d11a-4b54-8823-1dff6792916d",
      "name": "must be policyname new",
      "description": "",
      "created_by": "a3e5c076-311c-46af-97cd-d1e529512afe",
      "updated_by": null
    },
    "type": "security_policy"
  }
}
```
[Go to Table of Contents](#table-of-contents)

#### List Policies

Get all of your selected organization's security policies  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  

[Document link](https://developer.mantiumai.com/reference/list_policies_v1_security_policies_get)

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
  await mantiumAi
    .Security()
    .listPolicies({ page: 1, size: 2 })
    .then((response) => {
      console.log('*********** listpolicies response *********');
      console.log(response);
    });
  /*
  * API Key is set on above
  * mantiumAi.api_key=`key`
  * so we can call these method directly now
  */
})();
```
#### Example of a successful API response
```js
{
  data: [
    {
      id: 'policy_id',
      type: 'security_policy',
      attributes: [{
        id: 'policy_id',
        type: 'security_policy',
        attributes: {
          policy_id: '07af5486-f77c-48c2-9ccf-318c81643736',
          name: 'some policyname',
          description: 'some description for policy',
          rules: [ [Object] ],
          actions: [ [Object], [Object], [Object] ],
          organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
          organization_name: ' ',
          created_by_name: ' ',
          created_by_email: 'kedman1234@gmail.com',
          updated_by_name: '',
          updated_by_email: null
        },
        relationships: { notifications: { data: [] } }
      },
      {
        id: 'policy_id',
        type: 'security_policy',
        attributes: {
          policy_id: '052059b8-d9e7-4fda-b8c7-13fb02103b4c',
          name: 'must be policyname new',
          description: '',
          rules: [ [Object] ],
          actions: [ [Object], [Object], [Object] ],
          organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
          organization_name: ' ',
          created_by_name: ' ',
          created_by_email: 'kedman1234@gmail.com',
          updated_by_name: '',
          updated_by_email: null
        },
        relationships: { notifications: { data: [] } }
    }],
      relationships: [Object]
    },
    {
      id: 'policy_id',
      type: 'security_policy',
      attributes: [Object],
      relationships: [Object]
    }
  ],
  included: null,
  meta: null,
  links: { total_items: 34, current_page: 1, next_page: 2 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Get policy

Get a specific Security Policy for your selected organization  

`id`* (string) required parameter, The policy ID  


[Document link](https://developer.mantiumai.com/reference/get_policy_v1_security_policy__policy_id__get)

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
  await mantiumAi
    .Security()
    .policy('39a17204-aa6c-46c7-ae0c-fe664f6397b0')
    .then((response) => {
      console.log('*********** policy response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: [{
    attributes: {
      policy_id: '39a17204-aa6c-46c7-ae0c-fe664f6397b0',
      name: 'max char 2 policy',
      description: 'max char 2 policy',
      rules: [Array],
      actions: [Array],
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      organization_name: ' ',
      created_by_name: ' ',
      created_by_email: 'kedman1234@gmail.com',
      updated_by_name: '',
      updated_by_email: null
    },
    relationships: { notifications: [Object] },
    type: 'security_policy',
    id: 'policy_id'
  }]
}
```
[Go to Table of Contents](#table-of-contents)

#### Get policy using ID url

Get a specific Security Policy for your selected organization  

`id`* (string) required parameter, The policy ID  

[Document link](https://developer.mantiumai.com/reference/get_policy_v1_security_policies_id__policy_id__get)

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
  await mantiumAi
    .Security()
    .policyId('39a17204-aa6c-46c7-ae0c-fe664f6397b0')
    .then((response) => {
      console.log('*********** retrievePolicy response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: [{
    attributes: {
      policy_id: '39a17204-aa6c-46c7-ae0c-fe664f6397b0',
      name: 'max char 2 policy',
      description: 'max char 2 policy',
      rules: [Array],
      actions: [Array],
      organization_id: 'c68c07c9-d11a-4b54-8823-1dff6792916d',
      organization_name: ' ',
      created_by_name: ' ',
      created_by_email: 'kedman1234@gmail.com',
      updated_by_name: '',
      updated_by_email: null
    },
    relationships: { notifications: [Object] },
    type: 'security_policy',
    id: 'policy_id'
  }]
}
```
[Go to Table of Contents](#table-of-contents)

#### List Rules

List available Security Rules  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  

[Document link](https://developer.mantiumai.com/reference/list_rules_v1_security_rules_get)

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
  await mantiumAi
    .Security()
    .listRules({ page: 1, size: 2 })
    .then((response) => {
      console.log('*********** listRules response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: [
    {
      id: '0a3e489e-aa59-634b-82bf-c2f81dd67608',
      type: 'security_rule',
      attributes: [Object],
      relationships: {}
    },
    {
      id: '6a8282b9-03d1-4a89-0291-73709998efab',
      type: 'security_rule',
      attributes: [Object],
      relationships: {}
    }
  ],
  included: null,
  meta: null,
  links: { total_items: 15, current_page: 1, next_page: 2 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Get rule

Get a specific Security Rule  

`id`* (string) required parameter, The rule ID  

[Document link](https://developer.mantiumai.com/reference/get_rule_v1_security_rule__rule_id__get)

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
  await mantiumAi
    .Security()
    .rule('0a3e489e-aa59-634b-82bf-c2f81dd67608')
    .then((response) => {
      console.log('*********** rule response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: {
    id: '0a3e489e-aa59-634b-82bf-c2f81dd67608',
    type: 'security_rule',
    attributes: {
      rule_id: '0a3e489e-aa59-634b-82bf-c2f81dd67608',
      name: 'Ai21 Input Characters',
      description: 'Maximum Input Characters for a given prompt',
      ai_provider: 'Ai21',
      preprocessor: true,
      postprocessor: false,
      parameter_template: [Array]
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Get rule using ID url

Get a specific Security Rule  

`id`* (string) required parameter, The rule ID  

[Document link](https://developer.mantiumai.com/reference#access_token_login_v1_auth_login_access_token_post)

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
  await mantiumAi
    .Security()
    .ruleId('0a3e489e-aa59-634b-82bf-c2f81dd67608')
    .then((response) => {
      console.log('*********** ruleId response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: {
    id: '0a3e489e-aa59-634b-82bf-c2f81dd67608',
    type: 'security_rule',
    attributes: {
      rule_id: '0a3e489e-aa59-634b-82bf-c2f81dd67608',
      name: 'Ai21 Input Characters',
      description: 'Maximum Input Characters for a given prompt',
      ai_provider: 'Ai21',
      preprocessor: true,
      postprocessor: false,
      parameter_template: [Array]
    },
    relationships: {}
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### List Action Types

List available Security Action Types  

These are added to a Security Policy to tell it what to do after a Security Rule is violated.  

Query Params  
`Page` Page number  
`Size` Page size. If not supplied, returns all the results in a single page for certain APIs.  

[Document link](https://developer.mantiumai.com/reference/list_action_types_v1_security_action_types_get)

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
  await mantiumAi
    .Security()
    .listActionTypes({ page: 1, size: 2 })
    .then((response) => {
      console.log('*********** listActionTypes response *********');
      console.log(response);
      console.log(response.data);
    });
})();
```
#### Example of a successful API response
```js
{
  data: [
    {
      id: '1e378559-7015-4271-a3f1-abcd2c663c40',
      type: 'action_type',
      attributes: {
        action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
        name: 'Log Warning',
        description: 'Record a Warning in the logs',
        configurable: false
      },
      relationships: { parameter_template: [Object] }
    },
    {
      id: 'a49e30e3-da97-49a1-b501-7840358825ba',
      type: 'action_type',
      attributes: {
        action_type_id: 'a49e30e3-da97-49a1-b501-7840358825ba',
        name: 'Halt Processing',
        description: 'Immediately stop processing the prompt',
        configurable: false
      },
      relationships: { parameter_template: [Object] }
    }
  ],
  included: null,
  meta: null,
  links: { total_items: 5, current_page: 1, next_page: 2 }
}
```
[Go to Table of Contents](#table-of-contents)

#### Get Action Type

Get a specific Security ActionType  

`id`* (string) required parameter, The action_type_id  

[Document link](https://developer.mantiumai.com/reference/get_action_type_v1_security_action_type__action_type_id__get)

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
  await mantiumAi
    .Security()
    .actionType('1e378559-7015-4271-a3f1-abcd2c663c40')
    .then((response) => {
      console.log('*********** actionType response *********');
      console.log(response);
    });
})();
```
#### Example of a successful API response
```js
{
  data: {
    id: '1e378559-7015-4271-a3f1-abcd2c663c40',
    type: 'action_type',
    attributes: {
      action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
      name: 'Log Warning',
      description: 'Record a Warning in the logs',
      configurable: false
    },
    relationships: { parameter_template: [Object] }
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)

#### Get Action Type using ID url

Get a specific Security ActionType  

`id`* (string) required parameter, The action_type_id  

[Document link](https://developer.mantiumai.com/reference/get_action_type_v1_security_action_types_id__action_type_id__get)

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
  await mantiumAi
    .Security()
    .actionTypeId('1e378559-7015-4271-a3f1-abcd2c663c40')
    .then((response) => {
      console.log('*********** actionTypeId response *********');
      console.log(response);
    });  
})();
```
#### Example of a successful API response
```js
{
  data: {
    id: '1e378559-7015-4271-a3f1-abcd2c663c40',
    type: 'action_type',
    attributes: {
      action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
      name: 'Log Warning',
      description: 'Record a Warning in the logs',
      configurable: false
    },
    relationships: { parameter_template: [Object] }
  },
  included: [],
  meta: {},
  links: {}
}
```
[Go to Table of Contents](#table-of-contents)
