const request = require('request');
const index = require('../index');

module.exports = function (
  /**
   * Returns Object as response in the API call.
   *
   * @param {object} options the param in key,pair values pass in request for POST method
   * @return {object} AI Api response.
   */
  options
) {
  const apiPromise = new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
      } else {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
        if (response.statusCode <= 201 && response.body === '') {
          response.body = JSON.stringify({
            success: true,
            status: response.statusCode,
            error: '',
            warning_message: '',
          });
        }
        if (options.isWithInterval) {
          setTimeout(
            () => resolve(JSON.parse(response.body)),
            index.getResultStatusInterval()
          );
        } else {
          resolve(JSON.parse(response.body));
        }
      }
    });
  });

  try {
    return apiPromise;
  } catch (err) {
    return err;
  }
};
