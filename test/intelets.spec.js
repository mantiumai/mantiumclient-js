require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Intelets', function () {
  let inteletID = undefined;
  let inteletExecutionId = undefined;
  let sampleIntelet = {
    name: 'Testing intelet name',
    description: 'description for the intelet',
    prompts: [
      '41f62edf-9b0f-4397-8254-21dfc95e4efe',
      '23c217b8-1f87-4222-9e3c-e3bf4497c217',
    ],
  };

  it('should create the Intelet', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .create(sampleIntelet)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    inteletID = methodResponse.data.attributes.intelet_id;
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'intelet',
      'intelet type object received'
    );
    assert.equal(
      methodResponse.data.attributes.name,
      sampleIntelet.name,
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      sampleIntelet.description,
      'Description is matched'
    );
    assert.typeOf(inteletID, 'string', 'id received');
  });

  it('should return the Intelet using ID URL', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .retrieveId(inteletID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'intelet_view',
      'intelet type object received'
    );
    assert.equal(
      methodResponse.data.attributes.intelet_id,
      inteletID,
      'ID is matched'
    );
    assert.equal(
      methodResponse.data.attributes.name,
      sampleIntelet.name,
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      sampleIntelet.description,
      'Description is matched'
    );
    assert.typeOf(inteletID, 'string', 'id received');
  });

  it('should return the Intelet', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .retrieve(inteletID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'intelet_view',
      'intelet type object received'
    );
    assert.equal(
      methodResponse.data.attributes.intelet_id,
      inteletID,
      'ID is matched'
    );
    assert.equal(
      methodResponse.data.attributes.name,
      sampleIntelet.name,
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      sampleIntelet.description,
      'Description is matched'
    );
    assert.typeOf(inteletID, 'string', 'id received');
  });

  it('should update Intelet', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .update({
        id: inteletID,
        name: 'update the Intelet',
        description: 'Updated new Intelet Description',
      })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    inteletID = methodResponse.data.attributes.intelet_id;
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'intelet',
      'intelet type object received'
    );
    assert.equal(
      methodResponse.data.attributes.name,
      'update the Intelet',
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      'Updated new Intelet Description',
      'Description is updated successfully'
    );
    assert.typeOf(inteletID, 'string', 'id received');
  });

  it('should return the list of all Intelets', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .list({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('array');
  });

  it('should execute a specific Intelets', async function () {
    let input = 'What is the meaning of life?';

    const methodResponse = await mantiumAi
      .Intelets()
      .execute({
        id: inteletID,
        input,
      })
      .then((response) => {
        response.should.be.an('object');
        inteletExecutionId = response?.intelet_execution_id;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).should.be.an('object');
    expect(methodResponse).to.have.property('status');
    assert.equal(methodResponse.input, input, 'input is matched');
  });

  it('should get a Result using Intelets Execution ID', async function () {
    let input = 'What is the meaning of life?';

    const methodResponse = await mantiumAi
      .Intelets()
      .result(inteletExecutionId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).should.be.an('object');
    expect(methodResponse).to.have.property('status');
    expect(methodResponse).to.have.property('output');
    assert.equal(methodResponse.input, input, 'input is matched');
  });

  it('should remove a specific Prompt', async function () {
    const methodResponse = await mantiumAi
      .Intelets()
      .remove(inteletID)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.equal(methodResponse, 'Intelet Deleted', 'Intelet is Deleted');
  });
});
