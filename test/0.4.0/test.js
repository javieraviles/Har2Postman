const harToPostman = require('../../lib/har-to-postman.js');
const fs = require('fs');
const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));
const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
const postmanCollection = JSON.parse(postmanContent);

it('Generates multiple items for the same collection', () => {
    expect(postmanCollection.item.length).not.toBeLessThan(2);
});

it('Generates 0.4.0 output json (postman) given the 0.4.0 input json (har)', () => {
    expect(expectedPostmanCollection).toEqual(postmanCollection);
});
