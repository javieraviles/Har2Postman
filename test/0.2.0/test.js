describe('Har2Postman', function () {
    var harToPostman = require('../../lib/har-to-postman.js');
    var fs = require('fs');
    var harFile = JSON.parse(fs.readFileSync(__dirname + '/input.json', 'utf8'));
    var expectedPostmanCollection = JSON.parse(fs.readFileSync(__dirname + '/output.json', 'utf8'));

    it('should include item event', function() {
        var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
        var postmanCollection = JSON.parse(postmanContent);
        expect(postmanCollection.item.length).toEqual(1);
        expect(postmanCollection.item[0].event.length).toEqual(1);
    });

    it('should generate postman script that asserts call with response -200-', function() {
        var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
        var postmanCollection = JSON.parse(postmanContent);
        var itemEvent = postmanCollection.item[0].event[0];
        expect(itemEvent.listen).toEqual("test");
        expect(itemEvent.script.type).toEqual("text/javascript");
        expect(itemEvent.script).toBeDefined();
        expect(itemEvent.script.exec.length).toEqual(3);
        itemEvent.script.exec.map((e,i) => {
            expect(e).toEqual(expectedPostmanCollection.item[0].event[0].script.exec[i]);
        });
    });

    it("Generates 0.2.0 output json (postman) given the 0.2.0 input json (har)", function () {
        var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
        var postmanCollection = JSON.parse(postmanContent);
        expect(expectedPostmanCollection).toEqual(postmanCollection);
    });


});
