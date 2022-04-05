const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  // in HITL Post must have id as ID is refer as prompt_execution_id and it required in the URL
  if (
    ['GET', 'PATCH', 'DELETE', 'POST'].includes(opt.method) &&
    utils.isNil(opt.id) &&
    opt.io_type === 'item'
  )
    throw new Error(msg.errorMessages().id_missing);

  const id = utils.isNotNil(opt.id) ? '/' + opt.id : '';
  const action = utils.isNotNil(opt.action_type) ? '/' + opt.action_type : '';

  let options = {
    method: opt.method,
    url: config
      .hitlURL(opt.isIdURL)
      .concat(id, utils.objToQueryStr(opt.queryParam), action),
    headers: headers.getHeaders(),
  };

  if (['POST', 'PATCH', 'PUT'].includes(opt.method) && opt.io_type !== 'list') {
    options['body'] = JSON.stringify(opt.bodyPaylod);
  }

  return fetch(options);
};
