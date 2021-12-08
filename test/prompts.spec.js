require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Prompts', function () {
  let aiProvider = 'OpenAI';
  let promptID = undefined;
  let promptExecutionId = undefined;
  let samplePrompt = {
    name: 'create the Prompt',
    intelets: [],
    policies: [],
    tags: ['383fb5e6-6c30-4641-9850-efeb3cdd77b8'],
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

  it('should create the Prompt', async function () {
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

  it('should return the Prompt using ID URL', async function () {
    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .retrieveId(promptID)
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
      'prompt',
      'prompt type object received'
    );
    assert.equal(
      methodResponse.data.attributes.prompt_id,
      promptID,
      'ID is matched'
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

  it('should return the Prompt', async function () {
    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .retrieve(promptID)
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
      'prompt',
      'prompt type object received'
    );
    assert.equal(
      methodResponse.data.attributes.prompt_id,
      promptID,
      'ID is matched'
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

  it('should update Prompt', async function () {
    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .update({
        id: promptID,
        name: 'update the Prompt',
        description: 'Updated new Prompt Description',
        prompt_text: 'Updated new Prompt Line',
        prompt_parameters: {
          advanced_settings: {
            n: '1',
          },
        },
      })
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
      'update the Prompt',
      'Name is matched'
    );
    assert.equal(
      methodResponse.data.attributes.description,
      'Updated new Prompt Description',
      'Description is updated successfully'
    );
    assert.equal(
      methodResponse.data.attributes.prompt_text,
      'Updated new Prompt Line',
      'Updated prompt text is matched'
    );
    assert.equal(
      methodResponse.data.attributes.prompt_parameters.advanced_settings.n,
      '1',
      'Updated new advanced prompt settings'
    );
    assert.equal(
      methodResponse.data.attributes.ai_provider,
      aiProvider,
      'AI Provider is matched'
    );
    assert.typeOf(promptID, 'string', 'id received');
  });

  it('should return the list of all Prompts', async function () {
    const methodResponse = await mantiumAi
      .Prompts()
      .list({ page: 1, size: 20, show_public_shareable: false })
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

  it('should execute a specific Prompt', async function () {
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

  it('should get a Result using Prompt Execution ID', async function () {
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

  it('should remove a specific Prompt', async function () {
    const methodResponse = await mantiumAi
      .Prompts()
      .remove(promptID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(methodResponse).should.be.an('object');
    expect(methodResponse).to.be.empty;
  });
});
