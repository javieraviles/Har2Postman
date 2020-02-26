# Har2Postman
Javascript Har to Postman converter

## Purpose
The main goal of the project is the creation of a JS library to convert `.har` files to Postman requests/collection in `.JSON` format.

`HTTP Archive format` or `HAR` files are a JSON-formatted archive file format for logging of a web browser's interaction with a site (HTTP transactions).

On the other hand `Postman` is a testing API client tool, allowing us to test a request against a specific environment.

The intended *audience* is, therefore, anybody who finds a use case where this library is useful in any way.

## Roadmap
### v0.1.0 - Convert simplest GET request from HAR to Postman
* Create a first basic JS function able to produce a `JSON` output matching the content of the file `/test/0.1.0/output.json` given a `JSON` input matching the content of the file `/test/0.1.0/input.json`.
* There should be a test case ensuring this is working.
* Create a very simple CI pipeline

### v0.2.0 - Create simple postman test
* The output file should also include basic test assertions for postman if `includeTest` option is selected. Again the given input `/test/0.2.0/input.json` should produce the output `/test/0.2.0/output.json`.
* There should be a test case ensuring this is working.