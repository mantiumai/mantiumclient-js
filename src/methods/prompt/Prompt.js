const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  if (
    ['POST', 'PATCH'].includes(opt.method) &&
    !utils.isNotNilOrEmptyString(opt.ai_provider)
  )
    throw new Error(msg.errorMessages().Provider_missing);

  if (
    ['GET', 'PATCH', 'DELETE'].includes(opt.method) &&
    utils.isNil(opt.id) &&
    opt.type === 'item'
  )
    throw new Error(msg.errorMessages().id_missing);

  if (['POST', 'PATCH'].includes(opt.method) && utils.isNil(opt.name))
    throw new Error(msg.errorMessages().tag_name_missing);

  const id = utils.isNotNil(opt.id) ? opt.id : '';

  let options = {
    method: opt.method,
    url: config
      .promptURL(opt.isIdURL)
      .concat('/', id, utils.objToQueryStr(opt.queryParam)),
    headers: headers.getHeaders(),
  };

  console.log('options :::', options);

  if (opt.name && opt.type !== 'list') {
    options['body'] = JSON.stringify(opt);
  }

  // return options;
  return fetch(options);
};
