require('./setup');

const mantiumAi = require('../src/index');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should();

describe('Tags', function () {
  let tagID = undefined;
  let sampleTag = {
    name: 'sample tag name',
    description: 'Some description',
  };

  it('should create the tag', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .create(sampleTag)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });

    tagID = tagsResponse.data.attributes.tag_id;
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('object');
    assert.equal(tagsResponse.data.type, 'tag', 'Tag type object received');
    assert.equal(
      tagsResponse.data.attributes.name,
      sampleTag.name,
      'Name is matched'
    );
    assert.equal(
      tagsResponse.data.attributes.description,
      sampleTag.description,
      'Description is matched'
    );
    assert.typeOf(tagID, 'string', 'id received');
  });

  it('should return the Tag using ID URL', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .retrieveId(tagID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('object');
    assert.equal(tagsResponse.data.type, 'tag', 'Tag type object received');
    assert.equal(tagsResponse.data.attributes.tag_id, tagID, 'ID is matched');
    assert.equal(
      tagsResponse.data.attributes.name,
      sampleTag.name,
      'Name is matched'
    );
    assert.equal(
      tagsResponse.data.attributes.description,
      sampleTag.description,
      'Description is matched'
    );
  });

  it('should return the Tag', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .retrieve(tagID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('object');
    assert.equal(tagsResponse.data.type, 'tag', 'Tag type object received');
    assert.equal(tagsResponse.data.attributes.tag_id, tagID, 'ID is matched');
    assert.equal(
      tagsResponse.data.attributes.name,
      sampleTag.name,
      'Name is matched'
    );
    assert.equal(
      tagsResponse.data.attributes.description,
      sampleTag.description,
      'Description is matched'
    );
  });

  it('should update Tags', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .update({
        id: tagID,
        name: 'Updated sample tag name',
        description: 'Some long description',
      })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('object');
    assert.equal(tagsResponse.data.type, 'tag', 'Tag type object received');
    assert.equal(tagsResponse.data.attributes.tag_id, tagID, 'ID is matched');
    assert.equal(
      tagsResponse.data.attributes.name,
      'Updated sample tag name',
      'Name is matched'
    );
    assert.equal(
      tagsResponse.data.attributes.description,
      'Some long description',
      'Description is matched'
    );
  });

  it('should return the list of all Tags', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .list({ page: 1, size: 20 })
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('array');
  });

  it('should remove a specific Tag', async function () {
    const tagsResponse = await mantiumAi
      .Tags()
      .remove(tagID)
      .then((response) => {
        response.should.be.an('object');
        return response;
      })
      .catch((err) => {
        should.not.exist(err);
      });
    expect(tagsResponse).to.have.property('data');
    expect(tagsResponse.data).to.be.an('object');
  });
});
