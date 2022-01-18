require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Securities', function () {
  let policyID = undefined;
  let ruleId = undefined;
  let actionTypeId = undefined;
  let samplePolicy = {
    name: 'some policyname',
    description: 'some description for policy',
    rules: [
      {
        rule_id: '8bc66446-c72d-4627-a3f4-cf942383cee5',
        parameters: {
          max_input_characters: '2',
          scope: 'per_prompt',
        },
      },
    ],
    actions: [
      {
        action_type_id: '1e378559-7015-4271-a3f1-abcd2c663c40',
      },
      {
        action_type_id: 'a49e30e3-da97-49a1-b501-7840358825ba',
      },
      {
        action_type_id: '72d64ca0-35bf-4646-9782-90634d7b6b97',
      },
    ],
    notifications: [],
  };

  it('should create the policy', async function () {
    let policy = undefined;
    const response = await mantiumAi
      .Security()
      .createPolicy(samplePolicy)
      .then((response) => {
        response.should.be.an('object');
        policy = response.data[0];
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    policyID = policy.attributes.policy_id;
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
    assert.equal(
      policy.type,
      'security_policy',
      'security policy type object received'
    );
    assert.equal(policy.attributes.name, samplePolicy.name, 'Name is matched');
    assert.equal(
      policy.attributes.description,
      samplePolicy.description,
      'Description is matched'
    );
    assert.equal(policy.attributes.updated_at, null, 'Policy is newly created');
    assert.typeOf(policyID, 'string', 'id received');
  });

  it('should return the Policy using ID URL', async function () {
    let policy = undefined;
    const response = await mantiumAi
      .Security()
      .policyId(policyID)
      .then((response) => {
        response.should.be.an('object');
        policy = response.data[0];
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
    assert.equal(
      policy.type,
      'security_policy',
      'security policy type object received'
    );
    assert.equal(policy.attributes.policy_id, policyID, 'ID is matched');
    assert.equal(policy.attributes.name, samplePolicy.name, 'Name is matched');
    assert.equal(
      policy.attributes.description,
      samplePolicy.description,
      'Description is matched'
    );
  });

  it('should return the Policy', async function () {
    let policy = undefined;
    const response = await mantiumAi
      .Security()
      .policy(policyID)
      .then((response) => {
        response.should.be.an('object');
        policy = response.data[0];
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
    assert.equal(
      policy.type,
      'security_policy',
      'security policy type object received'
    );
    assert.equal(policy.attributes.policy_id, policyID, 'ID is matched');
    assert.equal(policy.attributes.name, samplePolicy.name, 'Name is matched');
    assert.equal(
      policy.attributes.description,
      samplePolicy.description,
      'Description is matched'
    );
  });

  it('should update Policy', async function () {
    let policy = undefined;
    const response = await mantiumAi
      .Security()
      .updatePolicy({
        id: policyID,
        name: 'Updated sample policy name',
        description: 'Some long description',
        rules: [],
        actions: [],
        notifications: [],
      })
      .then((response) => {
        response.should.be.an('object');
        policy = response.data;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    expect(response).to.have.property('data');
    expect(response.data).to.be.an('object');
    assert.equal(
      policy.type,
      'security_policy',
      'security policy type object received'
    );
    assert.equal(policy.attributes.policy_id, policyID, 'ID is matched');
    assert.equal(
      policy.attributes.name,
      'Updated sample policy name',
      'Name is matched'
    );
    assert.equal(
      policy.attributes.description,
      'Some long description',
      'Description is matched'
    );
  });

  it('should return the list of all security policies', async function () {
    const response = await mantiumAi
      .Security()
      .listPolicies({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
  });

  it('should remove a specific Policy', async function () {
    const response = await mantiumAi
      .Security()
      .removePolicy(policyID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('object');
  });

  it('should return the list of all security rules', async function () {
    const response = await mantiumAi
      .Security()
      .listRules({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        ruleId = response.data[0].id;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
  });

  it('should return the rule from security', async function () {
    const response = await mantiumAi
      .Security()
      .rule(ruleId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.typeOf(response.data.id, 'string', 'id received');
    assert.equal(response.data.id, ruleId, 'ID is matched');
    expect(response).to.have.property('data');
    assert.equal(
      response.data.type,
      'security_rule',
      'security rule type object received'
    );
  });

  it('should return the rule using ID URL from security', async function () {
    const response = await mantiumAi
      .Security()
      .ruleId(ruleId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.typeOf(response.data.id, 'string', 'id received');
    assert.equal(response.data.id, ruleId, 'ID is matched');
    expect(response).to.have.property('data');
    assert.equal(
      response.data.type,
      'security_rule',
      'security rule type object received'
    );
  });

  it('should return the list of all Action Type', async function () {
    const response = await mantiumAi
      .Security()
      .listActionTypes({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        actionTypeId = response.data[0].id;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(response).to.have.property('data');
    expect(response.data).to.be.an('array');
  });

  it('should return the action type from security', async function () {
    const response = await mantiumAi
      .Security()
      .actionType(actionTypeId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.typeOf(response.data.id, 'string', 'id received');
    assert.equal(response.data.id, actionTypeId, 'ID is matched');
    expect(response).to.have.property('data');
    assert.equal(
      response.data.type,
      'action_type',
      'action type object received'
    );
  });

  it('should return the action type using ID URL', async function () {
    const response = await mantiumAi
      .Security()
      .actionTypeId(actionTypeId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.typeOf(response.data.id, 'string', 'id received');
    assert.equal(response.data.id, actionTypeId, 'ID is matched');
    expect(response).to.have.property('data');
    assert.equal(
      response.data.type,
      'action_type',
      'action type object received'
    );
  });
});
