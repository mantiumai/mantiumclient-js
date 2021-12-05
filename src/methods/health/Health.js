const config = require('../../config/config');
const fetch = require('../fetch');

module.exports = function (headers) {
  let options = {
    method: 'GET',
    url: config
      .apiHealthURL(),
    headers: headers.getHeaders(),
  };

  return fetch(options);
};
