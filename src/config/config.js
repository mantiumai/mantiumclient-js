const index = require('../index');

module.exports = {
  /*
   * Construct base URL
   */
  baseURL() {
    return `${index.getOrigin()}/${index.getApiVersion()}`;
  },

  /*
   * Auth endpoints
   * https://developer.mantiumai.com/reference#auth
   */
  accessTokenLoginURL() {
    return `${this.baseURL()}/auth/login/access/token`;
  },
  revokeTokenURL() {
    return `${this.baseURL()}/auth/user/revoke/token`;
  },

  /*
   * List Methods
   * https://developer.mantiumai.com/reference#ai_methods
   */
  aiMethodsURL() {
    return `${this.baseURL()}/ai_methods`;
  },

  /*
   * Get All Ai Engines
   * https://developer.mantiumai.com/reference#ai-engines
   */
  aiEnginesAllURL() {
    return `${this.baseURL()}/ai/engine/all`;
  },
  aiEnginesByProviderURL() {
    return `${this.baseURL()}/ai/engine/get/ai/providers`;
  },
  aiEnginesByNameURL() {
    return `${this.baseURL()}/ai/engine/get/name`;
  },

  /*
   * Tags
   * https://developer.mantiumai.com/reference#tags
   */
  tagsURL(isOldURL = false) {
    return `${this.baseURL()}/tag${isOldURL ? '/id' : ''}`;
  },

  /*
   * Prompts
   * https://developer.mantiumai.com/reference#prompts
   */
  promptURL(isOldURL = false) {
    return `${this.baseURL()}/prompt${isOldURL ? '/id' : ''}`;
  },

  promptExecuteURL(id) {
    return `${this.baseURL()}/prompt/${id}/execute`;
  },

  promptResultURL() {
    return `${this.baseURL()}/prompt/result`;
  },
};
