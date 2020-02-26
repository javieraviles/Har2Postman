# Har2Postman
Javascript Har to Postman converter. *THIS PROJECT IS RIGHT     NOW UNDER HEAVY DEVELOPMENT*

## Purpose
The main goal of the project is the creation of a JS library to convert `.har` files to Postman requests/collection in `.JSON` format.

`HTTP Archive format` or `HAR` files are a JSON-formatted archive file format for logging of a web browser's interaction with a site (HTTP transactions).

On the other hand `Postman` is a testing API client tool, allowing us to test a request against a specific environment.

The intended *audience* is, therefore, anybody who finds a use case where this library is useful in any way.

## Roadmap
Please note every version should include a suite of test cases ensuring new requirements are working. The last test case of the suite should check the library produces a `JSON` output matching the content of the file `/test/x.x.x/output.json` given a `JSON` input matching the content of the file `/test/x.x.x/input.json`.

### v0.1.0 - Convert simplest GET request from HAR to Postman
* Create a first basic JS `createPostmanCollection` function able to produce a valid postman collection including the expected `file` () and `item` (request itself) objects out of a `har` file.
* Create a CI pipeline, executing jasmine tests on every push and updating the `Har2Postman` in npm if new tag is released.

### v0.2.0 - Create simple postman test for a GET request
* The output file should also include basic test assertions in GET requests for postman based on the response section from `har` file.
* The `createPostmanCollection` function should include a second optional `boolean` argument to decide whether the output should include the test section or not. By default, the behaviour of the boolean flag should be `false`.

### v0.3.0 - GET request might include query params
* A GET request might include `query params`; those should also be mapped from the har file to the postman collection.