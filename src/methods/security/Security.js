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

  if (['POST', 'PATCH'].includes(opt.method) && utils.isNil(opt.name))
    throw new Error(msg.errorMessages().policy_name_missing);

  const id = utils.isNotNil(opt.id) ? '/' + opt.id : '';

  let options = {
    method: opt.method,
    url: config
      .securityURL(opt.isIdURL, opt.subUrl)
      .concat(id, utils.objToQueryStr(opt.queryParam)),
    headers: headers.getHeaders(),
  };

  if (['POST', 'PATCH', 'PUT'].includes(opt.method) && opt.io_type !== 'list') {
    delete opt.io_type; // internal use only
    delete opt.isIdURL; // internal use only
    delete opt.subUrl; // internal use only
    delete opt.method; // internal use only
    options['body'] = JSON.stringify(opt);
  }

  return fetch(options);
};
