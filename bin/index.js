#!/usr/bin/env node

const harToPostman = require('../lib/har-to-postman.js');
const fs = require('fs');
const input = process.argv[2];
const output = process.argv[3];

const generateCollection = (harFile) => {
  const collection = harToPostman.createPostmanCollection(JSON.stringify(harFile), true);
  const outputFileName = output != undefined ? output : 'collection.json';
  fs.writeFile('./' + outputFileName, collection, function(err) {
    if (err) return console.log(err);
    return console.log('Generated collection in file: ' + outputFileName);
  });
};

if (input != undefined) {
  const harFile = JSON.parse(fs.readFileSync('./' + input, 'utf8'));
  generateCollection(harFile);
} else {
  console.log('Input file must be specified as the first argument. For example: har2postman harfile.json');
}

