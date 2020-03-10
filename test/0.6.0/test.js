const harToPostman = require('../../lib/har-to-postman.js');
const fs = require('fs');
const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));
const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
const postmanCollection = JSON.parse(postmanContent);

describe('Har2Postman', () => {
  it('Should be able to ignore non-json contents in response', () => {
    expect(postmanCollection.item[3].event[0].script.exec.length).toEqual(3);
  });

  it('Generates 0.6.0 output json (postman) given the 0.6.0 input json (har)', () => {
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });
});
