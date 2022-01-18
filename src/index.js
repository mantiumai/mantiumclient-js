const getOrigin = () => {
  return module.exports.ORIGIN;
};

const getApiVersion = () => {
  return module.exports.API_VERSION;
};

const getResultStatusInterval = () => {
  return module.exports.RESULT_STATUS_INTERVAL;
};

exports.getOrigin = getOrigin;
exports.getApiVersion = getApiVersion;
exports.getResultStatusInterval = getResultStatusInterval;

// Class Headers (used to set header)
const Headers = require('./methods/Headers');

const utils = require('./methods/utility');

// Auth
const Login = require('./methods/auth/Login');
const Logout = require('./methods/auth/Logout');

// Ai methods
const ListMethods = require('./methods/ai_methods/ListMethods');

// Ai Engines
const GetAllAiEngines = require('./methods/ai_engines/GetAllAiEngines');
const GetAiEnginesByProvider = require('./methods/ai_engines/GetAiEnginesByProvider');
const GetAiEngineByName = require('./methods/ai_engines/GetAiEngineByName');

// Tag
const Tag = require('./methods/tags/Tag');

// Prompt
const Prompt = require('./methods/prompt/Prompt');

// Logs
const Log = require('./methods/logs/Log');

// Intelet
const Intelet = require('./methods/intelets/Intelet');

// Health
const Health = require('./methods/health/Health');

// File
const File = require('./methods/files/File');
const FileUpload = require('./methods/files/FileUpload');
const FileSubmitAWS = require('./methods/files/FileSubmitAWS');

// Security
const Security = require('./methods/security/Security');

module.exports = {
  ORIGIN: 'https://api.mantiumai.com',
  API_VERSION: 'v1',
  RESULT_STATUS_INTERVAL: 500,

  api_key: null,
  ai_provider: 'mantium',
  organization: null,

  Auth: (function () {
    /**
     * Summary: Returns Object with bearer_id used for Authorization.
     *
     * @param {object} { username: useremail@somedomain.com , password: p@ssWord! } User's username, password.
     * @return {object} Obtain access token for a user.
     */
    function accessTokenLogin(data) {
      return Login(
        new Headers(module.exports.api_key, module.exports.organization),
        data
      );
    }

    /**
     * Summary: Returns Object as response in the API call.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     *
     * @return {object} Invalidate a user's Access token (logout).
     */
    function revokeToken() {
      return Logout(
        new Headers(module.exports.api_key, module.exports.organization)
      );
    }

    function main() {
      return {
        accessTokenLogin: accessTokenLogin,
        revokeToken: revokeToken,
      };
    }
    main.accessTokenLogin = accessTokenLogin;
    main.revokeToken = revokeToken;

    return main;
  })(),

  AiMethods: (function () {
    let ai_provider = undefined;

    /**
     * Summary: Get all of the supported ai_methods for a provider.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { page: 1, size: 2 } the query param in the format of key pair.
     * @return {Method} Provide method list in array format.
     */
    function list(queryParam) {
      return ListMethods(
        new Headers(module.exports.api_key, module.exports.organization),
        queryParam,
        ai_provider
      );
    }

    /**
     * Summary: take provider name to perfom GET AI methods.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @param {string} Provider some provider like `openai`, `cohere`, `mantium`, `OpenAI`, `Cohere`, `Mantium`
     * @return {Array} This return the list of methods for AiMethods.
     * - list
     */
    function main(p) {
      ai_provider = p;
      return {
        list: list,
      };
    }
    main.list = list;

    return main;
  })(),

  AiEngines: (function () {
    let name = undefined;

    /**
     * Summary: Get all of the configured and available AI engines.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { page: 1, size: 2 } the query param in the format of key pair.
     * @return {Array} Provide method list in array format.
     */
    function all(queryParam) {
      return GetAllAiEngines(
        new Headers(module.exports.api_key, module.exports.organization),
        queryParam
      );
    }

    /**
     * Summary: List all of the AI Engines for a specific AI Provider.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { page: 1, size: 2 } the query param in the format of key pair.
     * @return {Array} Provide method list in array format.
     */
    function byProvider(queryParam) {
      return GetAiEnginesByProvider(
        new Headers(module.exports.api_key, module.exports.organization),
        queryParam,
        name
      );
    }

    /**
     * Summary: Get the details for a specific AI Engine.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { page: 1, size: 2 } the query param in the format of key pair.
     * @return {object} Provide object type 'ai_engine'.
     */
    function byName(queryParam) {
      return GetAiEngineByName(
        new Headers(module.exports.api_key, module.exports.organization),
        queryParam,
        name
      );
    }

    /**
     * Summary: take provider or engine name to perfom GET AI Engines.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive), Only one parameter is required either `Provider Name` or `Engine`
     *
     * @param {string} Provider some provider like `openai`, `cohere`, `mantium`, `OpenAI`, `Cohere`, `Mantium`
     * @param {string} Engine AI Engine name.
     * @return {Method} This return the list of methods for AiEngines.
     * - all
     * - byProvider
     * - byName
     */
    function main(e) {
      name = e;
      return {
        all: all,
        byProvider: byProvider,
        byName: byName,
      };
    }
    main.all = all;
    main.byProvider = byProvider;
    main.byName = byName;

    return main;
  })(),

  Tags: (function () {
    /**
     * Summary: Get all of the tags for your selected organization.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { 'page': 1, 'size': 20 };
     *
     * @return {Array} Provide method list in array format.
     */
    function list(data) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'list', method: 'GET', queryParam: data }
      );
    }

    /**
     * Summary: Create a Tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { name: 'tag name', description: 'Some description' };
     *
     * @return {object} Provide object type 'tag'.
     */
    function create(data) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        Object.assign({ io_type: 'item', method: 'POST' }, data)
      );
    }

    /**
     * Summary: Update a Tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { id: 'tagid', name: 'tag name', description: 'Some description' };
     *
     * @return {object} Provide object type 'tag'.
     */
    function update(data) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        Object.assign({ io_type: 'item', method: 'PATCH' }, data)
      );
    }

    /**
     * Summary: Get details about a specific tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id tagid
     *
     * @return {object} Provide object type 'tag'.
     */
    function retrieve(id) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', id: id }
      );
    }

    /**
     * Summary: Get details about a specific tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id tagid
     *
     * @return {object} Provide object type 'tag'.
     */
    function retrieveId(id) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', isIdURL: true, id: id }
      );
    }

    /**
     * Summary: Remove a specific tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id tagid
     *
     * @return {object} Provide object type 'tag'.
     */
    function remove(id) {
      return Tag(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'DELETE', id: id }
      );
    }

    /**
     * Summary: Tags related operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @param {string} Provider some provider like `openai`, `cohere`, `mantium`, `OpenAI`, `Cohere`, `Mantium`
     * @return {Method} This return the list of methods for Tags.
     * - list
     * - create
     * - update
     * - retrieve
     * - retrieveId
     * - remove
     */
    function main() {
      return {
        list: list,
        create: create,
        update: update,
        retrieve: retrieve,
        retrieveId: retrieveId,
        remove: remove,
      };
    }

    main.list = list;
    main.create = create;
    main.update = update;
    main.retrieve = retrieve;
    main.retrieveId = retrieveId;
    main.remove = remove;

    return main;
  })(),

  Prompts: (function () {
    let provider = undefined;

    /**
     * Summary: Get all of the tags for your selected organization.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { 'page': 1, 'size': 20, 'show_public_shareable': false, 'adults_only': false, 'tags': `<tagid>`};
     *
     * @return {Array} Provide method list in array format.
     */
    function list(data) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'list', method: 'GET', queryParam: data }
      );
    }

    /**
     * Summary: Add Prompt
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { ...data }; [Object example](https://developer.mantiumai.com/reference#add_prompt_v1_prompt__post)
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function create(data) {
      const newLocal = Object.assign(
        {
          ai_provider: provider,
          io_type: 'item',
          method: 'POST',
        },
        data
      );
      const modifier = newLocal;

      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Update a Tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { ...data }; [Object example](https://developer.mantiumai.com/reference#add_prompt_v1_prompt__post)
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function update(data) {
      const newLocal = Object.assign(
        {
          ai_provider: provider,
          io_type: 'item',
          method: 'PATCH',
        },
        data
      );
      const modifier = newLocal;
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Get details about a specific prompt.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Prompt ID
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function retrieve(id) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', id: id }
      );
    }

    /**
     * Summary: Get details about a specific prompt.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Prompt ID
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function retrieveId(id) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', isIdURL: true, id: id }
      );
    }

    /**
     * Summary: Remove a specific Prompt.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Prompt ID
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function remove(id) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'DELETE', id: id }
      );
    }

    /**
     * Summary: Get details about a specific prompt.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} input { id: 'prompt_id', input: 'input text for the execute' }
     *
     * @return {object}  Provide object with `prompt_execution_id`.
     */
    function execute(data) {
      const newLocal = Object.assign(
        {
          ai_provider: provider,
          io_type: 'item',
          method: 'POST',
          id: data.id,
          action: 'execute',
        },
        data
      );
      const modifier = newLocal;
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Get details about a specific prompt.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} PromptExecutionId This will achive by using `Prompts('OpenAI').execute` [method](https://developer.mantiumai.com/reference#execute_prompt_v1_prompt__prompt_id__execute_post)
     *
     * @return {object}  Provide object with `prompt_execution_id`.
     */
    function result(PromptExecutionId, isWithInterval = true) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          ai_provider: provider,
          io_type: 'item',
          method: 'GET',
          id: PromptExecutionId,
          action: 'result',
        }
      ).then(function checkResponse(res) {
        if (
          res &&
          !['COMPLETED', 'REJECTED', 'INTERRUPTED', 'ERRORED'].includes(
            res.status
          )
        ) {
          return Prompt(
            new Headers(module.exports.api_key, module.exports.organization),
            {
              ai_provider: provider,
              io_type: 'item',
              method: 'GET',
              id: PromptExecutionId,
              action: 'result',
              isWithInterval,
            }
          ).then((response) => checkResponse(response));
        } else {
          return res;
        }
      });
    }

    /**
     * Summary: Prompt(s) related operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @param {string} Provider some provider like `openai`, `cohere`, `mantium`, `OpenAI`, `Cohere`, `Mantium`
     * @return {Method} This return the list of methods for Prompt.
     * - list
     * - create
     * - retrieve
     * - retrieveId
     * - remove
     * - execute
     * - result
     */
    function main(p) {
      provider = p;
      return {
        list: list,
        create: create,
        update: update,
        retrieve: retrieve,
        retrieveId: retrieveId,
        remove: remove,
        execute: execute,
        result: result,
      };
    }

    main.list = list;
    main.create = create;
    main.update = update;
    main.retrieve = retrieve;
    main.retrieveId = retrieveId;
    main.remove = remove;
    main.execute = execute;
    main.result = result;

    return main;
  })(),

  Logs: (function () {
    /**
     * Summary: List all Logs.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object {"page":"1","size":"20","after_date":"jan","before_date":"jan","log_type":"DEFAULT","log_level":"top","log_status":"completed"};
     *
     * @return {Array} Provide method list in array format.
     */
    function list(data) {
      return Log(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'list', method: 'GET', queryParam: data }
      );
    }

    /**
     * Summary: Get details about a specific log.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Prompt ID
     *
     * @return {object}  Provide object type 'log'.
     */
    function retrieve(id) {
      return Log(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', id: id }
      );
    }

    /**
     * Summary: Get details about a specific log.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Prompt ID
     *
     * @return {object}  Provide object type 'prompt'.
     */
    function retrieveId(id) {
      return Log(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', isIdURL: true, id: id }
      );
    }

    /**
     * Summary: Log(s) operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @return {Method} This return the list of methods for Prompt.
     * - list
     * - retrieve
     * - retrieveId
     */
    function main() {
      return {
        list: list,
        retrieve: retrieve,
        retrieveId: retrieveId,
      };
    }

    main.list = list;
    return main;
  })(),

  Intelets: (function () {
    /**
     * Summary: Get all of the tags for your selected organization.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { 'page': 1, 'size': 20, 'tags': `<tagid>`};
     *
     * @return {Array} Provide method list in array format.
     */
    function list(data) {
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'list', method: 'GET', queryParam: data }
      );
    }

    /**
     * Summary: Add Intelet
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { ...data }; [Object example](https://developer.mantiumai.com/reference#add_intelet_v1_intelet__post)
     *
     * @return {object}  Provide object type 'intelet'.
     */
    function create(data) {
      const newLocal = Object.assign(
        {
          io_type: 'item',
          method: 'POST',
        },
        data
      );
      const modifier = newLocal;

      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Update a Tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} object { ...data }; [Object example](https://developer.mantiumai.com/reference#add_intelet_v1_intelet__post)
     *
     * @return {object}  Provide object type 'intelet'.
     */
    function update(data) {
      const newLocal = Object.assign(
        {
          io_type: 'item',
          method: 'PATCH',
        },
        data
      );
      const modifier = newLocal;
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Get details about a specific intelet.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Intelet ID
     *
     * @return {object}  Provide object type 'intelet'.
     */
    function retrieve(id) {
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', id: id }
      );
    }

    /**
     * Summary: Get details about a specific intelet.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Intelet ID
     *
     * @return {object}  Provide object type 'intelet'.
     */
    function retrieveId(id) {
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'GET', isIdURL: true, id: id }
      );
    }

    /**
     * Summary: Remove a specific Intelet.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id Intelet ID
     *
     * @return {object}  Provide object type 'intelet'.
     */
    function remove(id) {
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'DELETE', id: id }
      );
    }

    /**
     * Summary: Get details about a specific intelet.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} input { id: 'intelet_id', input: 'input text for the execute' }
     *
     * @return {object}  Provide object with `intelet_execution_id`.
     */
    function execute(data) {
      const newLocal = Object.assign(
        {
          io_type: 'item',
          method: 'POST',
          id: data.id,
          action: 'execute',
        },
        data
      );
      const modifier = newLocal;
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        modifier
      );
    }

    /**
     * Summary: Get details about a specific intelet.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} InteletExecutionId This will achive by using `Intelets('OpenAI').execute` [method](https://developer.mantiumai.com/reference#execute_intelet_v1_intelet__intelet_id__execute_post)
     *
     * @return {object}  Provide object with `intelet_execution_id`.
     */
    function result(InteletExecutionId, isWithInterval = true) {
      return Intelet(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          id: InteletExecutionId,
          action: 'result',
        }
      ).then(function checkResponse(res) {
        if (
          res &&
          !['COMPLETED', 'REJECTED', 'INTERRUPTED', 'ERRORED'].includes(
            res.status
          )
        ) {
          return Intelet(
            new Headers(module.exports.api_key, module.exports.organization),
            {
              io_type: 'item',
              method: 'GET',
              id: InteletExecutionId,
              action: 'result',
              isWithInterval,
            }
          ).then((response) => checkResponse(response));
        } else {
          return res;
        }
      });
    }

    /**
     * Summary: Intelet(s) related operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @param {string} Provider some provider like `openai`, `cohere`, `mantium`, `OpenAI`, `Cohere`, `Mantium`
     * @return {Method} This return the list of methods for Intelets.
     * - list
     * - create
     * - retrieve
     * - retrieveId
     * - remove
     * - execute
     * - result
     */
    function main() {
      return {
        list: list,
        create: create,
        update: update,
        retrieve: retrieve,
        retrieveId: retrieveId,
        remove: remove,
        execute: execute,
        result: result,
      };
    }

    main.list = list;
    main.create = create;
    main.update = update;
    main.retrieve = retrieve;
    main.retrieveId = retrieveId;
    main.remove = remove;
    main.execute = execute;
    main.result = result;

    return main;
  })(),

  Health: (function () {
    /**
     * Summary: Check the API health.
     *
     * @return {string} Provide the response status in the string format.
     */
    function check() {
      return Health(new Headers());
    }

    /**
     * Summary: Check the API health.
     *
     * @return {Method} This return the list of methods for check API Health.
     * - check
     */
    function main() {
      return {
        check: check,
      };
    }

    main.check = check;
    return main;
  })(),

  Files: (function () {
    /**
     * Summary: Get the list of files currently loaded at OpenAI.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { file_type: 'ALL' } the query param in the format of key pair. `file_type` could be `ALL`|`FILES_ONLY`|`FINETUNE_ONLY`
     *
     * @return {Array} Provide method list in array format.
     */
    function list(data) {
      if (utils.isNil(data)) {
        data = { file_type: 'ALL' };
      } else if (data && utils.isNil(data['file_type'])) {
        data = Object.assign({ file_type: 'ALL' }, data);
      }

      return File(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'list', method: 'GET', queryParam: data }
      );
    }

    /**
     * Summary: Create a Tag.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { name: 'tag name', description: 'Some description' };
     *
     * @return {object} Provide object type 'tag'.
     */
    function upload(data) {
      let fileData = null;
      let upload = null;
      // Listen for data
      data.key.on('data', (chunk) => {
        fileData = chunk;
      });

      return FileUpload(
        new Headers(module.exports.api_key, module.exports.organization),
        Object.assign({ method: 'POST' }, data)
      ).then(async (res) => {
        const { upload_source, fine_tune_file_type, key, purpose } = data;

        if (res && res.data) {
          upload = await FileSubmitAWS(
            new Headers(module.exports.api_key, module.exports.organization),
            Object.assign(
              { file: fileData, method: 'PUT', contentLength: fileData.length },
              res.data.attributes
            )
          ).then((response) => {
            if (utils.isNotNil(response) && utils.isNotNil(upload_source)) {
              return Object.assign(response, {
                upload_source,
                fine_tune_file_type,
                path: key.path,
                purpose,
              });
            } else {
              return response;
            }
          });
        }
        return upload;
      });
    }

    /**
     * Summary: Remove a specific file.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} id fileid
     *
     * @return {object} Provide object type 'file'.
     */
    function remove(id) {
      return File(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'DELETE', id: id }
      );
    }

    /**
     * Summary: Files related operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     *
     * @return {Method} Get the list of files currently loaded at OpenAI.
     * - list
     * - upload
     * - remove
     */
    function main() {
      return {
        list: list,
        upload: upload,
        remove: remove,
      };
    }

    main.list = list;
    main.upload = upload;
    main.remove = remove;

    return main;
  })(),

  Security: (function () {
    /**
     * Summary: Create a Policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { name: 'policy name', description: 'Some description', rules: [], actions: [], notifications[] };
     *
     * @return {object} Provide object type 'policy'.
     */
    function createPolicy(data) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        Object.assign(
          { io_type: 'item', method: 'POST', subUrl: 'policy' },
          data
        )
      );
    }

    /**
     * Summary: Update a Policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { id: 'policy_id', name: 'policy name', description: 'Some description', rules: [], actions: [], notifications[] };
     *
     * @return {object} Provide object type 'policy'.
     */
    function updatePolicy(data) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        Object.assign(
          {
            io_type: 'item',
            method: 'PATCH',
            subUrl: 'policy',
            policy_id: data.id,
          },
          data
        )
      );
    }

    /**
     * Summary: Remove a specific policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} policy_id policy_id
     *
     * @return {object} Provide object type 'policy'.
     */
    function removePolicy(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        { io_type: 'item', method: 'DELETE', id: id, subUrl: 'policy' }
      );
    }

    /**
     * Summary: Get all of the security policies.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { 'page': 1, 'size': 20 };
     *
     * @return {Array} Provide method list in array format.
     */
    function listPolicies(data) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'list',
          method: 'GET',
          queryParam: data,
          subUrl: 'policies',
        }
      );
    }

    /**
     * Summary: Get details about a specific policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} policy_id policy_id
     *
     * @return {object} Provide object type 'policy'.
     */
    function policy(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          id: id,
          subUrl: 'policy',
        }
      );
    }

    /**
     * Summary: Get details about a specific policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} policy_id policy_id
     *
     * @return {object} Provide object type 'policy'.
     */
    function policyId(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          isIdURL: true,
          id: id,
          subUrl: 'policies',
        }
      );
    }

    /**
     * Summary: Get all of the security rules for policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { 'page': 1, 'size': 20 };
     *
     * @return {Array} Provide method list in array format.
     */
    function listRules(data) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'list',
          method: 'GET',
          queryParam: data,
          subUrl: 'rules',
        }
      );
    }

    /**
     * Summary: Get details about a specific rule.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} rule_id rule_id
     *
     * @return {object} Provide object type 'rule'.
     */
    function rule(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          id: id,
          subUrl: 'rule',
        }
      );
    }

    /**
     * Summary: Get details about a specific rule.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} rule_id rule_id
     *
     * @return {object} Provide object type 'rule'.
     */
    function ruleId(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          isIdURL: true,
          id: id,
          subUrl: 'rules',
        }
      );
    }

    /**
     * Summary: Get all of the security action types for policy.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {object} { 'page': 1, 'size': 20 };
     *
     * @return {Array} Provide method list in array format.
     */
    function listActionTypes(data) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'list',
          method: 'GET',
          queryParam: data,
          subUrl: 'action_types',
        }
      );
    }

    /**
     * Summary: Get details about a specific action type.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} action_type_id action_type_id
     *
     * @return {object} Provide object type 'action_type'.
     */
    function actionType(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          id: id,
          subUrl: 'action_type',
        }
      );
    }

    /**
     * Summary: Get details about a specific action type.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * @param {string} action_type_id action_type_id
     *
     * @return {object} Provide object type 'action_type'.
     */
    function actionTypeId(id) {
      return Security(
        new Headers(module.exports.api_key, module.exports.organization),
        {
          io_type: 'item',
          method: 'GET',
          isIdURL: true,
          id: id,
          subUrl: 'action_types',
        }
      );
    }

    /**
     * Summary: Security related operations.
     *
     * This method requires Header `Authorization: Bearer {bearer_id}`, you can obtain `bearer_id` using `.Auth().accessTokenLogin()` method.
     * AI Provider name (case sensitive)
     *
     * @return {Method} This return the list of methods for Security.
     * - createPolicy
     * - updatePolicy
     * - listPolicies
     * - policy
     * - policyId
     * - listRules
     * - rule
     * - ruleId
     * - listActionTypes
     * - actionType
     * - actionTypeId
     */
    function main() {
      return {
        createPolicy: createPolicy,
        updatePolicy: updatePolicy,
        removePolicy: removePolicy,
        listPolicies: listPolicies,
        policy: policy,
        policyId: policyId,
        listRules: listRules,
        rule: rule,
        ruleId: ruleId,
        listActionTypes: listActionTypes,
        actionType: actionType,
        actionTypeId: actionTypeId,
      };
    }

    main.createPolicy = createPolicy;
    main.updatePolicy = updatePolicy;
    main.removePolicy = removePolicy;
    main.listPolicies = listPolicies;
    main.policy = policy;
    main.policyId = policyId;
    main.listRules = listRules;
    main.rule = rule;
    main.ruleId = ruleId;
    main.listActionTypes = listActionTypes;
    main.actionType = actionType;
    main.actionTypeId = actionTypeId;

    return main;
  })(),
};
