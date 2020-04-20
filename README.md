# Har2Postman
[![npm version](https://badge.fury.io/js/har2postman.svg)](https://badge.fury.io/js/har2postman)

![Har2Postman](https://raw.githubusercontent.com/javieraviles/har2postman/master/docs/assets/img/logo.png) 

Javascript Har to Postman converter. [Try it out](https://javieraviles.github.io/Har2Postman/)

## Purpose
The main goal of the project is the creation of a JS library to convert `.har` files to Postman requests/collection in `.JSON` format.

`HTTP Archive format` or `HAR` files are a JSON-formatted archive file format for logging of a web browser's interaction with a site (HTTP transactions).

On the other hand `Postman` is a testing API client tool, allowing us to test a request against a specific environment.

The intended *audience* is, therefore, anybody who finds a use case where this library is useful in any way.

## Getting Started

### Install package

```bash
npm install har2postman
```

### Example

```javascript
var Har2Postman = require('har2postman');

var includeTests = true;
harToPostman.createPostmanCollection(stringifiedHarFile, includeTests);
```

### Options

- `includeTests`: default `false`, set to `true` for including test assertions in requests


## Authors

* **Rafael Paez** - [rafapaezbas](https://github.com/rafapaezbas)
* **Javier Aviles** - [javieraviles](https://github.com/javieraviles)

## Roadmap
Please note every version should include a suite of test cases ensuring new requirements are working. The last test case of the suite should check the library produces a `JSON` output matching the content of the file `/test/x.x.x/output.json` given a `JSON` input matching the content of the file `/test/x.x.x/input.json`.

### v0.1.0 - Convert simplest GET request from HAR to Postman
* Create a first basic JS `createPostmanCollection` function able to produce a valid postman collection including the expected `file` (postman metadata) and `item` (request itself) objects out of a `har` file.
* Create a CI pipeline, executing jasmine tests on every push and updating the `Har2Postman` in npm if new tag is released.

### v0.2.0 - Create simple postman test for a GET request
* The output file should also include basic test assertions in GET requests for postman based on the response section from `har` file (response code, maybe id if path param?).
* The `createPostmanCollection` function should include a second optional `boolean` argument to decide whether the output should include the test section or not. By default, the behaviour of the boolean flag should be `false`.
* Include basic usage example for the lib in docs.

### v0.3.0 - GET request might include query params
* A GET request might include multiple `query params`; those should also be mapped from the har file to the postman collection. Evaluate whether some of them (FK?) should be included as part of the test assertions.
* Evaluate if response is an array, if so, generate test assertion.
* Evaluate if response is not a json file, if so generate only status code assertion.
* CI pipeline should also include integration tests on tag release: using the just released version of the lib, generate a postman collection using the version input, and run it with newman so it checks the lib output works out of the box.
* Include ESLint, with some format scripts in the package and check the linting from the pipeline too.

### v0.4.0 - Support multiple requests within one har file
* A `har` file can contain multiple requests, and all them should be contained within the swagger collection.
* The provided examples contain api versioning; the lib should be able to deal with them.

### v0.5.0 - POST, PUT and DELETE methods should also be supported
* Even though the method is already picked up by the lib, some methods such POST or PUT might include a body.
* Some headers such `Content-Type` should be included in the request.

### v0.6.0 - Any status code must be supported
* Status code such as 200, 204, 400, 401, 403 or 404 must have specific assertions.
* Non-json responses should even not tried to be analysed.

### v0.7.0 - Relevant headers should be included
* Include relevant headers for each request, only the necessary ones.
* Make library compatible for Browser.
* Demo page automatically getting lib from cdn.

### v0.7.5 - Add cli execution
* Include the option for converting a har file into a collection from the command line.

### Future features still to be planned
* Url hostname of requests, if common, should come from an env variable
* Auth methods should not be included as simple headers, but collection auth method and inherit from there in every request
* support `xml` format
* when creating an object, might be interesting to save it's `id` if contained in response as env variable for future requests over same entity (GET, PUT or DELETE)
* Prepare nice docs
* Make sure every function generates only one type of data structure. F.e. this should be avoided: 

```javascript
var generateItem = function(){
  var item = [{
          name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, generateTest),
          event: generateItemEvent(harResponse, harRequestUrl),
          request: {
              method: harRequest.method,
              url: {
                  raw: harRequestUrl.toString(),
                  protocol: harRequestUrl.protocol.slice(0, -1),
                  host: harRequestUrl.hostname.split('.'),
                  path: harPathnameArray.slice(1)
              }
          }
      }];
}

```

The right way for this function would be: 

```javascript
 var generateItem = function(){
  return  [{
          name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, generateTest),
          event: generateItemEvent(harResponse, harRequestUrl),
          request: generateRequest(harRequest, harRequestUrl);
      }];
}

var generateRequest = function(){
  return {
           method: harRequest.method,
           url: generateUrl(harRequestUrl);
         }
}

//var generateUrl = function() ...

```

**Also important** have a look at the functions returning arrays instead of objects, this will have to change in the future if those arrays need more than one element.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
