module.exports = class {
  constructor(api_key, organization) {
    this.api_key = api_key;
    this.organization = organization;
  }

  getHeaders() {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.api_key) {
      headers['Authorization'] = `Bearer ${this.api_key}`;
      // TODO(Kedar): Change the static text to dynamic
    }

    if (this.organization) {
      headers['OpenAI-Organization'] = this.organization;
    }

    return headers;
  }
};
