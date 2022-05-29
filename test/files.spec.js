require('./setup');

const mantiumAi = require('../src/index');
const expect = require('chai').expect;

describe('Files', function () {
  it('should return the list of all Files', async function () {
    const filesResponse = await mantiumAi
      .Files()
      .list({ file_type: 'FILES_ONLY' })
      .then((response) => {
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(filesResponse).to.have.property('data');
  });
});
