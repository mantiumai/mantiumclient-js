const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  if (
    ['GET', 'PATCH', 'DELETE'].includes(opt.method) &&
    utils.isNil(opt.id) &&
    opt.io_type === 'item'
  )
    throw new Error(msg.errorMessages().id_missing);

  const id = utils.isNotNil(opt.id) ? opt.id : '';

  let options = {
    method: opt.method,
    url: config
      .logsURL(opt.isIdURL)
      .concat('/', id, utils.objToQueryStr(opt.queryParam)),
    headers: headers.getHeaders(),
  };

  return fetch(options);
};
