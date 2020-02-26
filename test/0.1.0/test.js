describe('Har2Postman', function () {
  var harToPostman = require('../../lib/har-to-postman.js');
  var fs = require('fs');
  var harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
  var expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));

  it('Throws an error given a non JSON string as entry', function () {
    var postmanContent = harToPostman.createPostmanCollection('any non json argument');
    expect(postmanContent).toEqual('invalid json');
  });

  it('Generates info section for postman collection', function () {
    var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
    var postmanCollection = JSON.parse(postmanContent);
    expect(postmanCollection.info.name).toEqual('Har2Postman');
    expect(postmanCollection.info.schema).toEqual('https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
    expect(postmanCollection.info._postman_id).toMatch('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
  });

  it('Generates an item in the output with a name composed out of method + url pathname', function () {
    var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
    var postmanCollection = JSON.parse(postmanContent);
    expect(postmanCollection.item[0].name).toEqual('GET /posts/1');
  });

  it('Generates an item in the output with a request containing GET method, no headers and a valid url object', function () {
    var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
    var postmanCollection = JSON.parse(postmanContent);
    expect(postmanCollection.item[0].request.method).toEqual('GET');
    expect(postmanCollection.item[0].request.header).toEqual([]);
    expect(postmanCollection.item[0].request.url).toEqual({ raw: "https://jsonplaceholder.typicode.com/posts/1", protocol: "https", host: ["jsonplaceholder", "typicode", "com"], path: ["posts", "1"] });
  });

  it("Generates 0.1.0 output json (postman) given the 0.1.0 input json (har)", function () {
    var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
    var postmanCollection = JSON.parse(postmanContent);
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });

});
