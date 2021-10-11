const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');

module.exports = function (headers, { email } = {}) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);
  let options = {
    method: 'POST',
    url: config.resetPasswordURL(),
    headers: headers.getHeaders(),
    body: JSON.stringify({
      email,
    }),
  };

  return fetch(options);
};
