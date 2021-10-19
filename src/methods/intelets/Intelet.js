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

  /*
   * id - inteletId || inteletExecutionId ||
   */

  const id = utils.isNotNil(opt.id) ? opt.id : '';

  let url = config
    .inteletURL(opt.isIdURL)
    .concat('/', id, utils.objToQueryStr(opt.queryParam));

  if (utils.isNotNil(opt.action) && opt.action === 'execute') {
    if (id === '') throw new Error(msg.errorMessages().id_missing);
    url = config.inteletExecuteURL(opt.id);
  }

  if (utils.isNotNil(opt.action) && opt.action === 'result') {
    if (id === '') throw new Error(msg.errorMessages().id_missing);
    url = config.inteletResultURL().concat('/', id);
  }

  let options = {
    method: opt.method,
    url,
    headers: headers.getHeaders(),
    isWithInterval: utils.isNotNil(opt.isWithInterval)
      ? opt.isWithInterval
      : false,
  };

  if (['POST', 'PATCH', 'PUT'].includes(opt.method) && opt.io_type !== 'list') {
    delete opt.io_type; // internal use only
    delete opt.isIdURL; // internal use only
    options['body'] = JSON.stringify(opt);
  }

  return fetch(options);
};
