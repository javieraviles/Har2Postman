const harToPostman = require('../../lib/har-to-postman.js');
const fs = require('fs');
const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));
const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
const postmanCollection = JSON.parse(postmanContent);

describe('Har2Postman', () => {
  it('should include query array within the url in case query params are present', () => {
    expect(postmanCollection.item[0].request.url.query).toBeDefined();
    expect(postmanCollection.item[0].request.url.query).toEqual([
      {
        'key': 'userId',
        'value': '1',
      },
      {
        'key': 'mockParam',
        'value': 'mockValue',
      },
    ]);
  });

  it('should include query params at the end of the raw url string', () => {
    expect(postmanCollection.item[0].request.url.raw).toEqual(
        'https://jsonplaceholder.typicode.com/posts?userId=1&mockParam=mockValue');
  });

  it('Generates 0.3.0 output json (postman) given the 0.3.0 input json (har)', () => {
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });
});

