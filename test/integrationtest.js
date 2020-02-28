var harToPostman = require('../lib/har-to-postman.js');
var fs = require('fs');

var args = process.argv;
var version = args[2];
var harFile = JSON.parse(fs.readFileSync(__dirname + '/' + version + '/input.json', 'utf8'));
var postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
fs.writeFileSync(__dirname + '/libOutput.json', postmanContent, 'utf8');