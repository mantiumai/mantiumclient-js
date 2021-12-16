const msg = require('../../config/error-message');
const fetch = require('../fetch');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  const { url, method } = opt;

  let options = {
    method,
    url,
    headers: headers.getHeaders(),
  };

  options.headers['content-length'] = opt.contentLength;

  delete options.headers.Authorization;

  return fetch(options);
};
