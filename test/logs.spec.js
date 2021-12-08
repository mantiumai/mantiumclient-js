require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Logs', function () {
  let logID = undefined;

  it('should return the list of all Logs', async function () {
    const logsResponse = await mantiumAi
      .Logs()
      .list({ page: 1, size: 2 })
      .then((response) => {
        response.should.be.an('object');
        logID = response.data[0].id;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(logsResponse).to.have.property('data');
    expect(logsResponse.data).to.be.an('array');
  });

  it('should return the Tag using ID URL', async function () {
    const logsResponse = await mantiumAi
      .Logs()
      .retrieveId(logID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(logsResponse).to.have.property('data');
    expect(logsResponse.data).to.be.an('object');
    assert.equal(logsResponse.data.type, 'log', 'Log type object received');
    assert.equal(logsResponse.data.attributes.log_id, logID, 'ID is matched');
  });

  it('should return the Tag', async function () {
    const logsResponse = await mantiumAi
      .Logs()
      .retrieve(logID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(logsResponse).to.have.property('data');
    expect(logsResponse.data).to.be.an('object');
    assert.equal(logsResponse.data.type, 'log', 'Log type object received');
    assert.equal(logsResponse.data.attributes.log_id, logID, 'ID is matched');
  });

});
