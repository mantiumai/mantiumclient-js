require('./setup');

const mantiumAi = require('../src/index');
const expect = require('chai').expect;
const should = require('chai').should();

describe('AI Methods', function () {
  it('should return the list of all supported ai_methods for a provider', async function () {
    const aiMethodsRespone = await mantiumAi
      .AiMethods('openai')
      .list({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(aiMethodsRespone).to.have.property('data');
    expect(aiMethodsRespone.data).to.be.an('array');
  });
});
