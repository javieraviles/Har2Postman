const harToPostman = require('../lib/har-to-postman.js');
const fs = require('fs');

const args = process.argv;
const version = args[2];
const harFile = JSON.parse(fs.readFileSync(__dirname + '/' + version + '/input.json', 'utf8'));
const postmanContent = harToPostman.createPostmanCollection(JSON.stringify(harFile));
fs.writeFileSync(__dirname + '/libOutput.json', postmanContent, 'utf8');
