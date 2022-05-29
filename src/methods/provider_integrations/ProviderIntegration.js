const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  if (
      ['POST', 'PATCH', 'DELETE'].includes(opt.method) &&
      !utils.isNotNilOrEmptyString(opt.ai_provider)
    )
      throw new Error(msg.errorMessages().Provider_missing);

  if (
    ['POST', 'PATCH'].includes(opt.method) &&
    utils.isNil(opt.api_key) &&
    opt.subUrl === 'verify_key' &&
    opt.io_type === 'item'
  )
    delete opt.isIdURL; // for verify_key if api_key is not provided then it need to removed from body payload

  if (
    ['POST', 'PATCH'].includes(opt.method) &&
    utils.isNil(opt.api_key) &&
    opt.io_type === 'item' &&
    opt.subUrl === 'save_key'
  )
    throw new Error(msg.errorMessages().key_missing);

  if (
    ['POST', 'PATCH', 'DELETE'].includes(opt.method) &&
    utils.isNotNil(opt.ai_provider) &&
    opt.io_type === 'item'
  )
    opt.subUrl = `${opt.subUrl}/${opt.ai_provider}`;

  let options = {
    method: opt.method,
    url: config
      .providerURL(opt.subUrl)
      .concat(utils.objToQueryStr(opt.queryParam)),
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
