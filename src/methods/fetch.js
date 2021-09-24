const request = require("request");
module.exports = function
    /**
     * Returns Object as response in the API call.
     *
     * @param {boolean} useAuthorization to tell is API with token.
     * @param {string} URL URL that use for fetch.
     * @param {string} method GET, POST, PUT, PATCH, DELETE, if not pass it consider as GET
     * @param {object} opts the param in key,pair values pass in header for POST method
     * @param {object} queryParam the param in key,pair values pass to create a query parm
     * @return {object} AI Api response.
     */
    sendRequest(
        useAuthorization = false,
        getApiKey,
        url,
        method = "GET",
        opts = {},
        queryParam = {}) {
        let camelToUnderscore = (key) => {
            let result = key.replace(/([A-Z])/g, " $1");
            return result.split(' ').join('_').toLowerCase();
        }

        const queryString = queryParam 
          ? Object.keys(queryParam).map(key => key + '=' + queryParam[key]).join('&')
          : '';

        const data = {};

        for (const key in opts) {
            data[camelToUnderscore(key)] = opts[key];
        }

        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        if (useAuthorization && getApiKey) {
            headers["Authorization"] = `Bearer ${getApiKey}`;
        }

        let options = {
            method,
            headers,
            url: url.concat('?', queryString),
            body: JSON.stringify(data)
        };

        /* *
        *
        * Console.log is testing purpose before build delete it
        * 
        * */
        console.log(headers);
        console.log(options);

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
        } catch(err) {
            return err;
        }
    };
