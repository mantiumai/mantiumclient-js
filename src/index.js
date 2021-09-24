"use strict";

const config   = require('./config/config');
const msg      = require('./config/error-message');
const request  = require('request');
class MantiumAI {

  constructor(api_key, ai_provider) {
    this._api_key = api_key;
    this._ai_provider = ai_provider;
  }

  /**
   * @param {any} _key
   */
  set setApiKey(_key) {
    this._api_key = _key;
  }

  /**
   * @return {string} bearer_id as key
   */
  get getApiKey() {
    return this._api_key;
  }

  /**
   * @param {any} _key
   */
   set setProvider(_provider) {
    this._ai_provider = _provider;
  }

  /**
   * @return {string} bearer_id as key
   */
  get getProvider() {
    return this._ai_provider || 'mantium';
  }

  /**
   * Returns Object as response in the API call.
   *
   * @param {boolean} useAuthorization to tell is API with token.
   * @param {string} URL URL that use for fetch.
   * @param {string} method GET, POST, PUT, PATCH, DELETE, if not pass it consider as GET
   * @param {object} opts the param in key,pair values pass in header for POST method
   * @param {object} queryParam the param in key,pair values pass to create a query parm
   * @return {object} AI Api response.
   */
  _sendRequest(
    useAuthorization = false,
    getApiKey,
    url,
    method = "GET",
    opts = {},
    queryParam = {}) {
    let camelToUnderscore = (key) => {
        let result = key.replace(/([A-Z])/g, " $1");
        return result.split(' ').join('_').toLowerCase();
    }

    const queryString = queryParam
      ? Object.keys(queryParam).map(key => key + '=' + queryParam[key]).join('&')
      : '';

    const data = {};

    for (const key in opts) {
        data[camelToUnderscore(key)] = opts[key];
    }

    let headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };

    if (useAuthorization && getApiKey) {
        headers["Authorization"] = `Bearer ${getApiKey}`;
    }

    let options = {
        method,
        headers,
        url: url.concat('?', queryString),
        body: JSON.stringify(data)
    };

    /* *
    *
    * Console.log is testing purpose before build delete it
    *
    * */
    console.log('*************** headers ***************');
    console.log(headers);
    console.log('*************** options ***************');
    console.log(options);

    const apiPromise = new Promise((resolve, reject) => {
        request(options, function (error, response) {
        if (error) {
            reject(error);
        } else {
            resolve(JSON.parse(response.body));
        }
        });
    });

    try {
        return apiPromise;
    } catch(err) {
        return err;
    }
  }
  /**
   * Returns Object as response in the API call.
   *
   * @param {string} username User's username.
   * @param {string} password User's password.
   * @return {object} Obtain access token for a user.
   */
  accessTokenLogin (username, password) {
    return this._sendRequest(
      false,
      this.getApiKey,
      config.accessTokenLoginURL(),
      'POST',
      { username, password }
    );
  }

  /**
   * Returns Object as response in the API call.
   *
   * @param {string} email User's username.
   * Header:Authorization {bearer_id} HTTP Authorization with the bearer_id
   * @return {object} Triggers a password reset user's password. An email with a link would be sent.
   */
   resetPassword (email) {
    if (!this._api_key) throw new Error(msg.errorMessages().access_token_missing);
    return this._sendRequest(
      true,
      this.getApiKey,
      config.resetPasswordURL(),
      'POST',
      { email }
    );
  }

  /**
   * Returns Object as response in the API call.
   *
   * Header:Authorization {bearer_id} HTTP Authorization with the bearer_id
   * @return {object} Invalidate a user's Access token (logout)
   */
   revokeToken () {
    return this._sendRequest(
      true,
      this.getApiKey,
      config.authRevokeTokenURL(),
      'POST'
    );
  }

  /*************** AI Methods ***************/

  /**
   * Get all of the supported ai_methods for a provider
   *
   * Header:Authorization {bearer_id} HTTP Authorization with the bearer_id
   * @return {object} Get all of the supported ai_methods for a provider
   */
   listMethods (queryParam) {
    return this._sendRequest(
      true,
      this.getApiKey,
      config.aiMethodsURL().concat('/', this._ai_provider),
      'GET',
      {},
      queryParam
    );
  }

}

module.exports = MantiumAI;