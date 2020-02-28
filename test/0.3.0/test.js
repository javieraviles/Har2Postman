describe('Har2Postman', () => {
  const harToPostman = require('../../lib/har-to-postman.js');
  const fs = require('fs');
  const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));

  it('should include query section within the url in case query params are present', () => {
    const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
    const postmanCollection = JSON.parse(postmanContent);
    expect(Object.keys(postmanCollection.item[0].request.url)).toContain('query');
  });
});

