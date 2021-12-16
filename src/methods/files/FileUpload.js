const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

  const { key, purpose, upload_source, method } = opt;

  if (!upload_source) throw new Error(msg.errorMessages().files.upload_source);

  delete opt.isIdURL; // internal use only

  let url = config.filesUploadURL();

  let options = {
    method,
    url,
    headers: headers.getHeaders(),
  };

  options['body'] = JSON.stringify({
    fine_tune_file_type: opt.fine_tune_file_type,
    purpose,
    key: key.path.replace(/^.*[\\\/]/, ''),
    upload_source,
  });

  return fetch(options);
};
