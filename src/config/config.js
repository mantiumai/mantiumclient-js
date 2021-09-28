// const DEFAULT_ENGINE = 'Mantium';
const ORIGIN = 'https://api.mantiumai.com';
const API_VERSION = 'v1';
const URL = `${ORIGIN}/${API_VERSION}`

module.exports = {

  /*
  * Auth endpoints
  * https://developer.mantiumai.com/reference#auth
  */
  accessTokenLoginURL() {
    return `${URL}/auth/login/access/token`;
  },
  resetPasswordURL() {
    return `${URL}/auth/user/reset/password`;
  },
  revokeTokenURL() {
    return `${URL}/auth/user/revoke/token`;
  },

  /*
  * List Methods
  * https://developer.mantiumai.com/reference#ai_methods
  */
  aiMethodsURL() {
    return `${URL}/ai_methods`;
  },

  /*
  * Get All Ai Engines
  * https://developer.mantiumai.com/reference#ai-engines
  */
  aiEnginesAllURL() {
    return `${URL}/ai/engine/all`;
  },
  aiEnginesByProviderURL() {
    return `${URL}/ai/engine/get/ai/providers`;
  },
  aiEnginesByNameURL() {
    return `${URL}/ai/engine/get/name`;
  },

  /*
  * Tags
  * https://developer.mantiumai.com/reference#tags
  */
  tagsURL(isOldURL = false) {
    return `${URL}/tag${isOldURL ? '/id' : ''}`;
  }
};