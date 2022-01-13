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
  tagsURL(isIdURL = false) {
    return `${this.baseURL()}/tag${isIdURL ? '/id' : ''}`;
  },

  /*
   * Prompts
   * https://developer.mantiumai.com/reference#prompts
   */
  promptURL(isIdURL = false) {
    return `${this.baseURL()}/prompt${isIdURL ? '/id' : ''}`;
  },

  promptExecuteURL(id) {
    return `${this.baseURL()}/prompt/${id}/execute`;
  },

  promptResultURL() {
    return `${this.baseURL()}/prompt/result`;
  },

  promptTryURL(id) {
    return `${this.baseURL()}/prompt/${id}/try`;
  },

  /*
   * Logs
   * https://developer.mantiumai.com/reference#logs
   */

  logsURL(isIdURL = false) {
    return `${this.baseURL()}/log${isIdURL ? '/id' : ''}`;
  },

  /*
   * Intelet
   * https://developer.mantiumai.com/reference#intelets
   */
  inteletURL(isIdURL = false) {
    return `${this.baseURL()}/intelet${isIdURL ? '/id' : ''}`;
  },

  inteletExecuteURL(id) {
    return `${this.baseURL()}/intelet/${id}/execute`;
  },

  inteletResultURL() {
    return `${this.baseURL()}/intelet/result`;
  },

  /*
   * API Health
   * https://developer.mantiumai.com/reference/api_health_health_get
   */
  apiHealthURL() {
    return `${index.getOrigin()}/health`;
  },

  /*
   * API Files
   * https://developer.mantiumai.com/reference/get_files_v1_files_openai_files_get
   */
  filesURL() {
    return `${this.baseURL()}/files/openai_files`;
  },

  filesUploadURL() {
    return `${this.baseURL()}/files/aws/signature`;
  },

  filesFinetuneURL() {
    return `${this.baseURL()}/files/finetunes`;
  },

  /*
   * Security
   * https://developer.mantiumai.com/reference/post_policy_v1_security_policy_post
   */
  securityURL(isIdURL = false, subUrl = null) {
    return `${this.baseURL()}/security${subUrl ? '/' + subUrl : ''}${
      isIdURL ? '/id' : ''
    }`;
  },
};
