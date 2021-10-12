const getOrigin = () => {
  return module.exports.ORIGIN;
};

const getApiVersion = () => {
  return module.exports.API_VERSION;
};

exports.getOrigin = getOrigin;
exports.getApiVersion = getApiVersion;

// Class Headers (used to set header)
const Headers = require('./methods/Headers');

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

module.exports = {
  ORIGIN: 'https://api.mantiumai.com',
  API_VERSION: 'v1',

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
        { type: 'list', method: 'GET', queryParam: data }
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
        Object.assign({ type: 'item', method: 'POST' }, data)
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
        Object.assign({ type: 'item', method: 'PATCH' }, data)
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
        { type: 'item', method: 'GET', id: id }
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
        { type: 'item', method: 'GET', id: id }
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
        { type: 'item', method: 'DELETE', id: id }
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
        { type: 'list', method: 'GET', queryParam: data }
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
          type: 'item',
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
          type: 'item',
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
    function retreive(id) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { type: 'item', method: 'GET', id: id }
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
    function retreiveId(id) {
      return Prompt(
        new Headers(module.exports.api_key, module.exports.organization),
        { type: 'item', method: 'GET', isOldURL: true, id: id }
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
        { type: 'item', method: 'DELETE', id: id }
      );
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
     * - retreive
     * - retreiveId
     * - remove
     */
    function main(p) {
      provider = p;
      return {
        list: list,
        create: create,
        update: update,
        retreive: retreive,
        retreiveId: retreiveId,
        remove: remove,
      };
    }

    main.list = list;
    main.create = create;

    return main;
  })(),
};
