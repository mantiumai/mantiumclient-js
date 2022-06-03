require('./setup');
require('dotenv').config();
const openAiKey = process.env.OPEN_AI_KEY;

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;

const msg = require('../src/config/error-message');

if (!openAiKey) throw new Error(msg.errorMessages().env_missing);

describe('Provider Integrations', function () {

  it('should return the list of all Providers and their status', async function () {
    const methodResponse = await mantiumAi
      .ProviderIntegrations()
      .list({ page: 1, size: 20 })
      .then((response) => {
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('array');
  });


  it('should return the Providers verify Key response', async function () {
    const methodResponse = await mantiumAi
      .ProviderIntegrations('openai')
      .verifyKey({ api_key: openAiKey })
      .then((response) => {
        expect(response).to.be.an('array');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse[0]).to.have.string('good');
  });


  it('should remove the Providers key', async function () {
    const methodResponse = await mantiumAi/*  */
      .ProviderIntegrations('openai')
      .removeKey()
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.have.string('Deleted');
  });


  it('should save the Providers key', async function () {
    const methodResponse = await mantiumAi
      .ProviderIntegrations('openai')
      .saveKey({ api_key: openAiKey, verified: false })
      .then((response) => {
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
      assert.equal(
        methodResponse.data.type,
        'api_key',
        'API key type object received'
      );
  });

});
