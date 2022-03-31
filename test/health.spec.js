const mantiumAi = require('../src/index');
const expect = require('chai').expect;

describe('Health', function () {
  it('should return the health status of api', async function () {
    const healthResponse = await mantiumAi
      .Health()
      .check()
      .then((response) => {
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(healthResponse)
      .to.be.a('string')
      .and.satisfy((msg) => msg.startsWith('OK'));
  });
});
