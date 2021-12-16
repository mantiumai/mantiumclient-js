const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  /*
   * id - file_id
   */

  const id = utils.isNotNil(opt.id) ? opt.id : '';

  let url = config
    .filesURL()
    .concat('/', id, utils.objToQueryStr(opt.queryParam));

  let options = {
    method: opt.method,
    url,
    headers: headers.getHeaders(),
    isWithInterval: false,
  };

  return fetch(options);
};
