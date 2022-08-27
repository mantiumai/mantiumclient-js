
<div style="padding:3rem 0">
    <img align='center' alt="Mantium" width="100%" style="max-width:1000px" src="https://cdn-images-1.medium.com/max/1000/1*ZqJ394G8iskCqPEUjRUqkA@2x.png"/>
</div>

<div>
  <h2>Build AI applications in minutes and manage them at scale.</h2>
  <h3>Use state of the art language models to build AI applications and automations, and manage them in our low-code cloud platform.</h3>
</div>


<div style="padding:3rem 0">
  <span style="margin-right: 15px">
    <img alt="GitHub followers" src="https://img.shields.io/github/followers/mantiumai?label=Github&style=flat" alt="Mantium" />
  </span>
  <span>
    <img src="https://komarev.com/ghpvc/?username=mantiumai&label=Profile%20views&color=0e75b6&style=flat" alt="Mantium" />
  </span> 
</div>

[Sign up now](https://app.mantiumai.com/signup)


### 📫 Connect with us:

[<img align="left" alt="Mantium | linkedin" margin="8px" width="22px" src="https://cdn.iconscout.com/icon/free/png-512/linkedin-160-461814.png" />][linkedin]

[<img align="left" alt="Mantium | email" width="22px" src="https://cdn.iconscout.com/icon/free/png-512/gmail-30-722694.png" />][email]

[<img align="left" alt="Mantium | twitter" width="22px" src="https://cdn.iconscout.com/icon/free/png-256/twitter-241-721979.png" />][twitter]

[<img align="left" alt="Mantium | discord" width="22px" src="https://cdn.iconscout.com/icon/free/png-256/discord-4054115-3353190.png" />][discord]



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
# A simple way to create and execute prompt using the Mantium JavaScript Client

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


## Table of Contents
- [Table of Contents](https://github.com/mantiumai/mantiumclient-js/wiki)
- [Quickstart:](https://github.com/mantiumai/mantiumclient-js/#quickstart)
- [Authentication](https://github.com/mantiumai/mantiumclient-js/#authentication)
- [Installation](https://github.com/mantiumai/mantiumclient-js/#installation)
- [Usage](https://github.com/mantiumai/mantiumclient-js/#usage)
  - [Initializing](https://github.com/mantiumai/mantiumclient-js/#initializing)
  - [Auth](https://github.com/mantiumai/mantiumclient-js/wiki/#auth)
    - [Login](https://github.com/mantiumai/mantiumclient-js/wiki/auth#login)
    - [Logout](https://github.com/mantiumai/mantiumclient-js/wiki/auth#logout)
  - [AI Methods](https://github.com/mantiumai/mantiumclient-js/wiki/#ai-methods)
    - [List Methods](https://github.com/mantiumai/mantiumclient-js/wiki/ai-methods#list-methods)
  - [AI Engines](https://github.com/mantiumai/mantiumclient-js/wiki/#ai-engines)
    - [Get All AI Engines](https://github.com/mantiumai/mantiumclient-js/wiki/ai-engines#get-all-ai-engines)
    - [Get AI Engines By Provider](https://github.com/mantiumai/mantiumclient-js/wiki/ai-engines#get-ai-engines-by-provider)
    - [Get AI Engine By Name](https://github.com/mantiumai/mantiumclient-js/wiki/ai-engines#get-ai-engine-by-name)
  - [Tags](https://github.com/mantiumai/mantiumclient-js/wiki/#tags)
    - [List Tags](https://github.com/mantiumai/mantiumclient-js/wiki/tags#list-tags)
    - [Create a Tag](https://github.com/mantiumai/mantiumclient-js/wiki/tags#create-a-tag)
    - [Get Tag using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/tags#get-tag-using-id-url)
    - [Get Tag](https://github.com/mantiumai/mantiumclient-js/wiki/tags#get-tag)
    - [Update Tag](https://github.com/mantiumai/mantiumclient-js/wiki/tags#update-tag)
    - [Delete Tag](https://github.com/mantiumai/mantiumclient-js/wiki/tags#delete-tag)
  - [Prompts](https://github.com/mantiumai/mantiumclient-js/wiki/#prompts)
    - [List Prompts](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#list-prompts)
    - [Create a Prompt](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#create-a-prompt)
    - [Update Prompt](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#update-prompt)
    - [Get Prompt using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#get-prompt-using-id-url)
    - [Get Prompt](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#get-prompt)
    - [Delete Prompt](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#delete-prompt)
    - [Execute Prompt](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#execute-prompt)
    - [Get Prompt Result](https://github.com/mantiumai/mantiumclient-js/wiki/prompts#get-prompt-result)
  - [Logs](https://github.com/mantiumai/mantiumclient-js/wiki/#logs)
    - [List Logs](https://github.com/mantiumai/mantiumclient-js/wiki/logs#list-logs)
    - [Get Log using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/logs#get-log-using-id-url)
    - [Get Log](https://github.com/mantiumai/mantiumclient-js/wiki/logs#get-log)
  - [Intelets](https://github.com/mantiumai/mantiumclient-js/wiki/#intelets)
    - [List Intelets](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#list-intelets)
    - [Create an Intelet](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#create-an-intelet)
    - [Correct data for creation](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#correct-data-for-creation)
    - [Update Intelet](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#update-intelet)
    - [Get an Intelet using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#get-an-intelet-using-id-url)
    - [Get an Intelet](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#get-an-intelet)
    - [Delete an Intelet](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#delete-an-intelet)
    - [Execute Intelet](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#execute-intelet)
    - [Get Intelet Result](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#get-intelet-result)
    - [Health](https://github.com/mantiumai/mantiumclient-js/wiki/intelets#health)
  - [Files](https://github.com/mantiumai/mantiumclient-js/wiki/#files)
    - [List Files](https://github.com/mantiumai/mantiumclient-js/wiki/files#list-files)
    - [upload a File](https://github.com/mantiumai/mantiumclient-js/wiki/files#upload-a-file)
    - [Delete File](https://github.com/mantiumai/mantiumclient-js/wiki/files#delete-file)
  - [security](https://github.com/mantiumai/mantiumclient-js/wiki/#security)
    - [Create Policy](https://github.com/mantiumai/mantiumclient-js/wiki/security#create-policy)
    - [Update Policy](https://github.com/mantiumai/mantiumclient-js/wiki/security#update-policy)
    - [Remove Policy](https://github.com/mantiumai/mantiumclient-js/wiki/security#remove-policy)
    - [List Policies](https://github.com/mantiumai/mantiumclient-js/wiki/security#list-policies)
    - [Get policy](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-policy)
    - [Get policy using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-policy-using-id-url)
    - [List Rules](https://github.com/mantiumai/mantiumclient-js/wiki/security#list-rules)
    - [Get rule](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-rule)
    - [Get rule using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-rule-using-id-url)
    - [List Action Types](https://github.com/mantiumai/mantiumclient-js/wiki/security#list-action-types)
    - [Get Action Type](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-action-type)
    - [Get Action Type using ID url](https://github.com/mantiumai/mantiumclient-js/wiki/security#get-action-type-using-id-url)
  - [Human in the Loop](https://github.com/mantiumai/mantiumclient-js/wiki/#human-in-the-loop)
    - [List HITL](https://github.com/mantiumai/mantiumclient-js/wiki/human-in-the-loop#list-hitl)
    - [Accept HITL](https://github.com/mantiumai/mantiumclient-js/wiki/human-in-the-loop#accept-hitl)
    - [Reject HITL](https://github.com/mantiumai/mantiumclient-js/wiki/human-in-the-loop#reject-hitl)
    - [Modify Output HITL](https://github.com/mantiumai/mantiumclient-js/wiki/human-in-the-loop#modify-output-hitl)
    - [Modify Input HITL](https://github.com/mantiumai/mantiumclient-js/wiki/human-in-the-loop#modify-input-hitl)
  - [Provider Integrations](https://github.com/mantiumai/mantiumclient-js/wiki/#provider-integrations)
    - [List Api Keys (GET)](https://github.com/mantiumai/mantiumclient-js/wiki/provider-integrations#list-api-keys-get)
    - [Verify Api Key (POST)](https://github.com/mantiumai/mantiumclient-js/wiki/provider-integrations#verify-api-key-post)
    - [Save Key (POST)](https://github.com/mantiumai/mantiumclient-js/wiki/provider-integrations#save-key-post)
    - [Delete Key (DELETE)](https://github.com/mantiumai/mantiumclient-js/wiki/provider-integrations#delete-key-delete)


### 🌱 Developer guide:  

- [<img align="left" alt="Mantium | discord" width="22px" src="https://cdn.iconscout.com/icon/free/png-256/medium-logo-3610097-3014862.png" />][medium]
- [Tutorials](https://developer.mantiumai.com/docs)
- [Code Recipes](https://developer.mantiumai.com/recipes)
- [The Mantium Developer Hub](https://developer.mantiumai.com/)

<!-- https://cdn.iconscout.com/icon/free/png-256/location-1912221-1617690.png -->
<!-- Link section -->

[twitter]: https://twitter.com/mantiumai
[medium]: https://medium.com/mantium
[email]: mailto:operations@mantiumai.com?Subject=Hear%20from%20you%20on%20github
[discord]: https://discord.com/invite/SscDru7dFB
[github]: https://github.com/mantiumai/
[linkedin]: https://www.linkedin.com/company/mantium/
[mantiumapi]: https://www.npmjs.com/package/@mantium/mantiumapi