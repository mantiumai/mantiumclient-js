const config = require('../../config/config');
const fetch = require('../fetch');

module.exports = function (headers, { username, password } = {}) {
  let options = {
    method: 'POST',
    url: config.accessTokenLoginURL(),
    headers: headers.getHeaders(),
    body: JSON.stringify({
      username,
      password,
    }),
  };

  return fetch(options);
};
