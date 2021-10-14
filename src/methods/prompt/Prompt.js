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

  /*
   * id - PromptId || PromptExecutionId ||
   */

  const id = utils.isNotNil(opt.id) ? opt.id : '';

  let url = config
    .promptURL(opt.isIdURL)
    .concat('/', id, utils.objToQueryStr(opt.queryParam));

  if (utils.isNotNil(opt.action) && opt.action === 'execute') {
    if (id === '') throw new Error(msg.errorMessages().id_missing);
    url = config.promptExecuteURL(opt.id);
  }

  if (utils.isNotNil(opt.action) && opt.action === 'result') {
    if (id === '') throw new Error(msg.errorMessages().id_missing);
    url = config.promptResultURL().concat('/', id);
  }

  let options = {
    method: opt.method,
    url,
    headers: headers.getHeaders(),
    isWithInterval: utils.isNotNil(opt.isWithInterval)
      ? opt.isWithInterval
      : false,
  };

  if (opt.action && opt.type !== 'list') {
    options['body'] = JSON.stringify(opt);
  }

  return fetch(options);
};
