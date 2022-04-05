require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Human in the Loop', async function () {
  var aiProvider = 'OpenAI';
  let policyID = undefined;
  var promptExecutionId = undefined;
  var promptID = undefined;
  const promptInput = 'This is my testing execute prompt';
  var samplePolicy = {
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

  async function runPromptExectue() {
    await mantiumAi
      .Prompts(aiProvider)
      .create(samplePrompt)
      .then(async (response) => {
        promptID = response.data.attributes.prompt_id;
        await mantiumAi
          .Prompts(aiProvider)
          .execute({
            id: promptID,
            input: promptInput,
          })
          .then(async (res) => {
            promptExecutionId = res?.prompt_execution_id;
            return await mantiumAi
              .Prompts(aiProvider)
              .result(promptExecutionId)
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
        return response;
      })
      .catch((err) => {
        console.log(err);
      });
    return false;
  }

  async function clearAllTestNotifications() {
    await mantiumAi
      .HITL()
      .list({ page: 1, size: 2 })
      .then((response) => {
        response.forEach(async (note) => {
          await mantiumAi.HITL().reject(note.prompt_execution_id);
          await mantiumAi.Prompts().remove(note.prompt_id);
        });
        return response;
      })
      .catch((err) => {
        console.log(err);
      });
    return false;
  }

  it('should return the list of all HITL', async function () {
    await runPromptExectue();
    const methodResponse = await mantiumAi
      .HITL()
      .list({ page: 1, size: 2 })
      .then((response) => {
        expect(response).to.be.an('array');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    const firstResponse = methodResponse[0];
    expect(methodResponse).to.be.an('array');
    expect(firstResponse).to.have.property('status');
    assert.equal(firstResponse.status, 'INTERRUPTED', 'HITL INTERRUPTED');
    await clearAllTestNotifications();
  });

  it('should fail modify output HITL, if provide wrong prompt execution ID', async function () {
    await runPromptExectue();
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
    await clearAllTestNotifications();
  });

  it('should modify output HITL', async function () {
    await runPromptExectue();
    const new_output = 'after interrupted updated new result';
    const methodResponse = await mantiumAi
      .HITL()
      .modifyOutput({
        id: promptExecutionId,
        new_output,
      })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.equal(methodResponse.input, promptInput, 'input is matched');
    assert.equal(methodResponse.output, new_output, 'new output is matched');
    expect([
      'COMPLETED',
      'REJECTED',
      'INTERRUPTED',
      'ERRORED',
      'QUEUED',
    ]).to.include(methodResponse.status);
    assert.equal(methodResponse.prompt_id, promptID, 'prompt ID is matched');
    assert.equal(
      methodResponse.prompt_execution_id,
      promptExecutionId,
      'Prompt execution Id is matched'
    );
    await clearAllTestNotifications();
  });

  it('should fail modify input HITL, if provide wrong prompt execution ID', async function () {
    await runPromptExectue();
    const methodResponse = await mantiumAi
      .HITL()
      .modifyInput({
        id: promptID,
        new_input: 'Le',
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
      'modifyInput: provide wrong prompt execution ID'
    );
    await clearAllTestNotifications();
  });

  it('should modify input HITL', async function () {
    await runPromptExectue();
    const new_input = 'Le';
    const methodResponse = await mantiumAi
      .HITL()
      .modifyInput({
        id: promptExecutionId,
        new_input,
      })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.equal(methodResponse.input, new_input, 'input is matched');
    expect([
      'COMPLETED',
      'REJECTED',
      'INTERRUPTED',
      'ERRORED',
      'QUEUED',
    ]).to.include(methodResponse.status);
    assert.equal(methodResponse.prompt_id, promptID, 'prompt ID is matched');
    assert.equal(
      methodResponse.prompt_execution_id,
      promptExecutionId,
      'Prompt execution Id is matched'
    );
    await clearAllTestNotifications();
  });

  it('should fail when accept HITL, if provide wrong prompt execution ID', async function () {
    await runPromptExectue();
    const methodResponse = await mantiumAi
      .HITL()
      .accept(promptID)
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
      'accept: provide wrong prompt execution ID'
    );
    await clearAllTestNotifications();
  });

  it('should accept HITL', async function () {
    await runPromptExectue();

    const methodResponse = await mantiumAi
      .HITL()
      .accept(promptExecutionId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    assert.equal(methodResponse.prompt_id, promptID, 'prompt ID is matched');
    assert.equal(
      methodResponse.prompt_execution_id,
      promptExecutionId,
      'prompt executionId ID is matched'
    );

    await clearAllTestNotifications();
  });

  it('should reject HITL', async function () {
    await runPromptExectue();
    const methodResponse = await mantiumAi
      .HITL()
      .reject(promptExecutionId)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    assert.equal(methodResponse.prompt_id, promptID, 'prompt ID is matched');
    assert.equal(
      methodResponse.prompt_execution_id,
      promptExecutionId,
      'prompt executionId ID is matched'
    );
    // clear last test notifications
    await clearAllTestNotifications();
  });
});
