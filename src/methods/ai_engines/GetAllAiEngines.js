const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, queryParam) {
  if (!headers.api_key) throw new Error(msg.errorMessages().access_token_missing);
  let options = {
    method: "GET",
    url: config.aiEnginesAllURL().concat('/', utils.objToQueryStr(queryParam)),
    headers: headers.getHeaders(),
  };

  return fetch(options);
};
