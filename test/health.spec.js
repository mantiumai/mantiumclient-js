const mantiumAi = require('../src/index');
const expect = require('chai').expect;
const should = require('chai').should();

describe('Health', function () {
  let response = undefined;

  it('should return the health status of api', async function () {
    const healthResponse = await mantiumAi
      .Health()
      .check()
      .then((response) => {
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(healthResponse)
      .to.be.a('string')
      .and.satisfy((msg) => msg.startsWith('OK'));
  });
});
