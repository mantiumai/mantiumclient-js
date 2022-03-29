require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Human in the Loop', function () {
  let aiProvider = 'OpenAI';
  let policyID = undefined;
  let ruleId = undefined;
  let actionTypeId = undefined;
  let promptExecutionId = undefined;
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
  let samplePrompt = {
    name: 'create the Prompt for a demo policy violation',
    intelets: [],
    policies: [],
    tags: [],
    status: 'ACTIVE',
    description: 'Basic Prompt Description',
    prompt_text: 'Endpoint Settings: Prompt Line',
    ai_method: 'completion',
    default_engine: 'ada',
    prompt_parameters: {
      basic_settings: {
        temperature: '1',
        max_tokens: '512',
        frequency_penalty: '1',
        presence_penalty: '1',
        top_p: '1',
        stop_seq: ['Basic Settings: Stop Sequence'],
      },
      advanced_settings: {
        best_of: '5',
        n: '2',
        logprobs: '10',
        echo: true,
        stream: true,
        logit_bias: [],
      },
    },
  };

  it('HITL Step 1: Create a policy', async function () {
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

    samplePrompt.policies.push(policyID);

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

  it('HITL Step 2: Create a Prompt using policy', async function () {
    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .create(samplePrompt)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    promptID = methodResponse.data.attributes.prompt_id;
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'prompt',
      'prompt type object received'
    );
    assert.equal(
      methodResponse.data.attributes.name,
      samplePrompt.name,
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      samplePrompt.description,
      'Description is matched'
    );
    assert.equal(
      methodResponse.data.attributes.ai_provider,
      aiProvider,
      'AI Provider is matched'
    );
    assert.typeOf(promptID, 'string', 'id received');
  });

  it('HITL Step 3: Execute a specific Prompt', async function () {
    let input = 'This is my testing execute prompt';
    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .execute({
        id: promptID,
        input,
      })
      .then((response) => {
        response.should.be.an('object');
        promptExecutionId = response?.prompt_execution_id;
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).should.be.an('object');
    expect(methodResponse).to.have.property('status');
    assert.equal(methodResponse.input, input, 'input is matched');
  });

  it('HITL Step 4: Get a Result using Prompt Execution ID', async function () {
    let input = 'This is my testing execute prompt';

    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .result(promptExecutionId)
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

  it('should return the list of all HITL', async function () {
    const methodResponse = await mantiumAi
      .HITL()
      .list({ page: 1, size: 2 })
      .then((response) => {
        // response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    // expect(methodResponse).to.have.property('data');
    const firstResponse = methodResponse[0];
    expect(methodResponse).to.be.an('array');
    expect(firstResponse).to.have.property('status');
    assert.equal(firstResponse.status, 'INTERRUPTED', 'HITL INTERRUPTED');
  });

  it('should fail modify output HITL, if provide wrong prompt execution ID', async function () {
    const methodResponse = await mantiumAi
      .HITL()
      .modifyOutput({
        id: promptID,
        new_output: 'after interrupted updated new result',
      })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).to.have.property('detail');
    assert.equal(
      methodResponse.detail,
      `Prompt execution ID ${promptID} isn't part of HITL`,
      'modifyOutput: provide wrong prompt execution ID'
    );
  });

  it('should modify output HITL', async function () {
    const methodResponse = await mantiumAi
      .HITL()
      .modifyOutput({
        id: promptExecutionId,
        new_output: 'after interrupted updated new result',
      })
      .then((response) => {
        console.log('HITL modifyOutput ', response);
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    // promptExecutionId
    // expect(methodResponse).to.have.property('data');
    // const firstResponse = methodResponse[0];
    // expect(methodResponse).to.be.an('array');

    // expect(methodResponse).to.have.property('detail');
    // assert.equal(
    //   methodResponse.detail,
    //   `Prompt execution ID ${promptID} isn't part of HITL`,
    //   'modifyOutput: provide wrong prompt execution ID'
    // );
  });
});
