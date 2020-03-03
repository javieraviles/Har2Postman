const harToPostman = require('../../lib/har-to-postman.js');
const fs = require('fs');
const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));
const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
const postmanCollection = JSON.parse(postmanContent);

describe('Har2Postman', () => {
  it('Is able to assign the correct method to each item', () => {
    postmanCollection.item.map((e, i) => {
      expect(e.request.method).toEqual(expectedPostmanCollection.item[i].request.method);
    });
  });

  it('Includes the correct body to each request in case there\'s any', () => {
    const itemsInCollectionContainingBody = [0, 2];
    itemsInCollectionContainingBody.map((positionInArray) => {
      expect(postmanCollection.item[positionInArray].request.body.mode).toEqual('raw');
      expect(postmanCollection.item[positionInArray].request.body.raw).
          toEqual(expectedPostmanCollection.item[positionInArray].request.body.raw);
      expect(postmanCollection.item[positionInArray].request.body.options.raw.language).toEqual('json');
    });
  });

  it('Includes relevant headers to each item', () => {
    const expectedHeadersPerItem = new Map([
      [0, [{
        'key': 'Content-Type',
        'value': 'application/json',
      }]],
      [2, [{
        'key': 'Content-Type',
        'value': 'application/json',
      }]],
    ]);

    expectedHeadersPerItem.forEach((expectedHeaders, positionInArray) => {
      expect(postmanCollection.item[positionInArray].request.header).toEqual(expectedHeaders);
    });
  });

  it('Generates 0.5.0 output json (postman) given the 0.5.0 input json (har)', () => {
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });
});
