const request = require("request");
module.exports = function
  /**
   * Returns Object as response in the API call.
   *
   * @param {object} options the param in key,pair values pass in request for POST method
   * @return {object} AI Api response.
   */
  (options) {


    console.log('options :::', options)
  const apiPromise = new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body));
      }
    });
  });

  try {
    return apiPromise;
  } catch (err) {
    return err;
  }
};
