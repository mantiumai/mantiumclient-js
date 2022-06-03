require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe('Prompts', function () {
  let aiProvider = 'OpenAI';
  let promptID = undefined;
  let promptExecutionId = undefined;

  let samplePrompt = {
    adults_only: false,
    ai_engine_id: "ce6850ef-bc78-4f7a-af5f-81fb9d9fb872",
    ai_method: "completion",
    name: 'create the Prompt for a demo policy violation',
    intelets: [],
    policies: [],
    tags: [],
    status: 'ACTIVE',
    description: 'Basic Prompt Description',
    prompt_text: 'Endpoint Settings: Prompt Line',
    default_engine: 'ada',
    search_model: null,
    prompt_parameters: {
      basic_settings: {
        temperature: 1,
        max_tokens: 16,
        frequency_penalty: 1,
        presence_penalty: 1,
        top_p: 1,
        stop_seq: ['Basic Settings: Stop Sequence'],
      },
      advanced_settings: {
        best_of: 5,
        n: 2,
        logprobs: 10,
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
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });

    promptID = methodResponse.data.id;
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
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'prompt',
      'prompt type object received'
    );
    assert.equal(
      methodResponse.data.id,
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
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.have.property('data');
    expect(methodResponse.data).to.be.an('object');
    assert.equal(
      methodResponse.data.type,
      'prompt',
      'prompt type object received'
    );
    assert.equal(
      methodResponse.data.id,
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
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });

    promptID = methodResponse.data.id;
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
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
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
        expect(response).to.be.an('object');
        promptExecutionId = response?.prompt_execution_id;
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.be.an('object');
    expect(methodResponse).to.have.property('status');
    assert.equal(methodResponse.input, input, 'input is matched');
  });

  it('should get a Result using Prompt Execution ID', async function () {
    let input = 'This is my testing execute prompt';

    const methodResponse = await mantiumAi
      .Prompts(aiProvider)
      .result(promptExecutionId)
      .then(async (response) => {
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.be.an('object');
    expect(methodResponse).to.have.property('status');
    expect(methodResponse).to.have.property('output');
    assert.equal(methodResponse.input, input, 'input is matched');
  });

  it('should remove a specific Prompt', async function () {
    const methodResponse = await mantiumAi
      .Prompts()
      .remove(promptID)
      .then((response) => {
        expect(response).to.be.an('object');
        return response;
      })
      .catch((err) => {
        throw new Error(err);
      });
    expect(methodResponse).to.be.an('object');
    expect(methodResponse).to.be.empty;
  });
});
