describe('Har2Postman', () => {
  const harToPostman = require('../../lib/har-to-postman.js');
  const fs = require('fs');
  const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
  const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));
  const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
  const postmanCollection = JSON.parse(postmanContent);

  it('Throws an error given a non JSON string as entry', () => {
    const postmanContent = harToPostman.createPostmanCollection('any non json argument');
    expect(postmanContent).toEqual('invalid json');
  });

  it('Generates info section for postman collection', () => {
    expect(postmanCollection.info.name).toEqual('Har2Postman');
    expect(postmanCollection.info.schema).toEqual('https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  });

  it('Generates an item in the output with a name composed out of method + url pathname', () => {
    expect(postmanCollection.item[0].name).toEqual('GET /posts/1');
  });

  it('Generates an item in the output with a request containing GET method and a valid url object', () => {
    expect(postmanCollection.item[0].request.method).toEqual('GET');
    expect(postmanCollection.item[0].request.url).toEqual(
        {
          raw: 'https://jsonplaceholder.typicode.com/posts/1',
          protocol: 'https',
          host: ['jsonplaceholder', 'typicode', 'com'],
          path: ['posts', '1'],
        },
    );
  });

  it('Generates 0.1.0 output json (postman) given the 0.1.0 input json (har)', () => {
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });
});
