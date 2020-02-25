const har2postman = require('../lib/har-to-postman');
var fs = require('fs');

describe("har2postman conversion tests", function(){

    it("Generate Postman test without expected response", function(){
        var input = JSON.parse(fs.readFileSync( __dirname + '/0.1.0/input.json', 'utf8'));
        var expectedOutput = JSON.parse(fs.readFileSync( __dirname + '/0.1.0/output.json', 'utf8'));
        var result = har2postman.createPostmanRequest(input);
        expect(JSON.stringify(expectedOutput)).toEqual(JSON.stringify(result));
    });

    it("Generate Postman test including an expected response (200)", function(){
        var input = JSON.parse(fs.readFileSync( __dirname + '/0.2.0/input.json', 'utf8'));
        var expectedOutput = JSON.parse(fs.readFileSync( __dirname + '/0.2.0/output.json', 'utf8'));
        var result = har2postman.createPostmanRequest(input);
        expect(JSON.stringify(expectedOutput)).toEqual(JSON.stringify(result));
    });

})
