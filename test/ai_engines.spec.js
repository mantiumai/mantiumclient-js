require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('AI Engines', function () {
  it('should return the list of all AI Engines', async function () {
    const AiEnginesResponse = await mantiumAi
      .AiEngines()
      .all({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(AiEnginesResponse).to.have.property('data');
    expect(AiEnginesResponse.data).to.be.an('array');
  });

  it('should return the AI Engine By Name', async function () {
    const specificEngine = await mantiumAi
      .AiEngines('davinci')
      .byName()
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(specificEngine).to.have.property('data');
    expect(specificEngine.data).to.be.an('object');
    assert.equal(
      specificEngine.data.type,
      'ai_engine',
      'AI Engine type object received'
    );
  });

  it('should return the AI Engines By Provider', async function () {
    const byProvider = await mantiumAi
      .AiEngines('openai')
      .byProvider({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(byProvider).to.have.property('data');
    expect(byProvider.data).to.be.an('array');
  });
});
