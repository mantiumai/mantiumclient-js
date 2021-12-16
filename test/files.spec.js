require('./setup');

const mantiumAi = require('../src/index');
const expect = require('chai').expect;
const should = require('chai').should();

describe('Files', function () {
  it('should return the list of all Files', async function () {
    const filesResponse = await mantiumAi
      .Files()
      .list({ file_type: 'FILES_ONLY' })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(filesResponse).to.have.property('data');
  });
});
