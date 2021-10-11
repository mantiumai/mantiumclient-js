const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');

module.exports = function (headers) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);
  let options = {
    method: 'POST',
    url: config.revokeTokenURL(),
    headers: headers.getHeaders(),
  };
  return fetch(options);
};
