// const config = require('../../config/config');
const msg = require('../../config/error-message');
const fetch = require('../fetch');
// const utils = require('../utility');

module.exports = function (headers, opt) {
  if (!headers.api_key)
    throw new Error(msg.errorMessages().access_token_missing);

    const { url, method } = opt;

    // if (!purpose) throw new Error(msg.errorMessages().files.purpose);
    // if (!key) throw new Error(msg.errorMessages().files.key);
    // if (!upload_source) throw new Error(msg.errorMessages().files.upload_source);

    // delete opt.isIdURL; // internal use only




  let options = {
    method,
    url,
    // key: key.path.replace(/^.*[\\\/]/, ''),
    // purpose,

    headers: headers.getHeaders(),
    // isWithInterval: false,
  };

  options.headers['content-length'] = opt.contentLength

  // 'content-length': opt.contentLength,

  delete options.headers.Authorization


  // Listen for data
  // key.on('data', chunk => {
  //     console.log('file str', chunk)
  // });

  // if(utils.isNotNil(opt.fine_tune_file_type)) options['fine_tune_file_type'] = opt.fine_tune_file_type;
  // if(utils.isNotNil(opt.purpose)) options['purpose'] = opt.purpose;
  // if(utils.isNotNil(opt.key)) options['key'] = key.path.replace(/^.*[\\\/]/, '');

/*
  options['body'] = JSON.stringify({
    data: opt.file,
  });
*/
  console.log('options :::', options)


  return fetch(options);
};
