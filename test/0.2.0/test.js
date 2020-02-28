describe('Har2Postman', () => {
  const harToPostman = require('../../lib/har-to-postman.js');
  const fs = require('fs');
  const harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
  const expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));

  it('should include item event', () => {
    const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
    const postmanCollection = JSON.parse(postmanContent);
    expect(postmanCollection.item.length).toEqual(1);
    expect(postmanCollection.item[0].event.length).toEqual(1);
  });

  it('should generate postman test that asserts call with response -200-', () => {
    const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
    const postmanCollection = JSON.parse(postmanContent);
    const itemEvent = postmanCollection.item[0].event[0];
    expect(itemEvent.listen).toEqual('test');
    expect(itemEvent.script.type).toEqual('text/javascript');
    expect(itemEvent.script).toBeDefined();
    itemEvent.script.exec.map((e, i) => {
      expect(e).toEqual(expectedPostmanCollection.item[0].event[0].script.exec[i]);
    });
  });

  it('should also generate postman test that asserts the fetched object is correct', () => {
    const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
    const postmanCollection = JSON.parse(postmanContent);
    const itemEvent = postmanCollection.item[0].event[0];
    expect(itemEvent.listen).toEqual('test');
    expect(itemEvent.script.type).toEqual('text/javascript');
    expect(itemEvent.script).toBeDefined();
    expect(itemEvent.script.exec.length).toEqual(7);
    itemEvent.script.exec.map((e, i) => {
      expect(e).toEqual(expectedPostmanCollection.item[0].event[0].script.exec[i]);
    });
  });

  it('Generates 0.2.0 output json (postman) given the 0.2.0 input json (har)', () => {
    const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
    const postmanCollection = JSON.parse(postmanContent);
    expect(expectedPostmanCollection).toEqual(postmanCollection);
  });
});
