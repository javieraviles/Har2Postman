describe('Har2Postman', function() {
  var harToPostman = require('../../lib/har-to-postman.js');

  it('will throw an error given a non json string as entry', function() {
    var postmanContent = harToPostman.convert('any non json argument');
    expect(postmanContent).toEqual('invalid json');
  });

  it('will generate info section for postman', function() {
    var postmanContent = harToPostman.convert('{"har":"isValid"}');
    var postmanContent = JSON.parse(postmanContent);
    expect(postmanContent.info.name).toEqual('Har2Postman');
    expect(postmanContent.info.schema).toEqual('https://schema.getpostman.com/json/collection/v2.1.0/collection.json');
  });

});
