const HarToPostman = () => { };

HarToPostman.createPostmanCollection = (harContent, includeTest = false) => {
  try {
    harContent = JSON.parse(harContent);
  } catch (e) {
    return 'invalid json';
  }
  const postmanContent = {};
  postmanContent.info = generateInfo();
  postmanContent.item = generateItem(harContent, includeTest);
  return JSON.stringify(postmanContent);
};

const generateInfo = () => {
  return {
    name: 'Har2Postman',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  };
};

const generateItem = (harContent, includeTest) => {
  const harRequest = harContent.log.entries[0].request;
  const harRequestUrl = new URL(harRequest.url);
  const harResponse = harContent.log.entries[0].response;
  const item = [{
    name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, includeTest),
    event: generateItemEvent(harResponse, harRequestUrl),
    request: generateItemRequest(harRequest),
  }];
  if (!includeTest) {
    delete item[0].event;
  }
  if (harRequest.queryString.length == 0) {
    delete item[0].request.url.query;
  }
  return item;
};

const generateItemRequest = (harRequest) => {
  const harRequestUrl = new URL(harRequest.url);
  return {
    method: harRequest.method,
    url: generateItemRequestUrl(harRequestUrl, harRequest.queryString),
  };
};

const generateItemRequestUrl = (harRequestUrl, queryString) => {
  const harPathnameArray = harRequestUrl.pathname.split('/');
  return {
    raw: harRequestUrl.toString(),
    protocol: harRequestUrl.protocol.slice(0, -1),
    host: harRequestUrl.hostname.split('.'),
    path: harPathnameArray.slice(1),
    query: generateQueryParams(queryString),
  };
};


const generateItemName = (method, path, responseCode, includeTest) => {
  let status = '';
  switch (responseCode) {
    case 200:
      status = 'successfully';
      break;
  }
  let itemName = method + ' ' + path;
  if (includeTest) {
    itemName += ' ' + status;
  }
  return itemName;
};

const generateItemEvent = (response, harRequestUrl) => {
  return [{
    listen: 'test',
    script: generateScript(response, harRequestUrl),
  }];
};

const generateScript = (response, harRequestUrl) => {
  let exec = [];

  exec = exec.concat(generateStatusCodeAssertion(response.status));

  if (responseContainsId(response, harRequestUrl)) {
    exec = exec.concat(generateIdAssertion(harRequestUrl));
  }

  if (responseIsArray(response)) {
    exec = exec.concat(generateArrayAssertion());
  }

  return {
    exec: exec,
    type: 'text/javascript'};
};

const generateQueryParams = (queryString) => {
  queryString.forEach((queryParam) => {
    queryParam.key = queryParam.name;
    delete queryParam.name;
  });
  return queryString;
};

const generateIdAssertion = (harRequestUrl) => {
  const id = getIdFromUrl(harRequestUrl);
  return ['pm.test("Fetched object should be the expected one", function () {',
    '    var jsonData = pm.response.json();', '    pm.expect(jsonData.id).to.eql(' + id + ');',
    '});'];
};

const generateStatusCodeAssertion = (status) => {
  return ['pm.test("Status code is ' + status + '", function () {',
    '    pm.response.to.have.status(' + status + ');',
    '});'];
};

const generateArrayAssertion = () => {
  return ['pm.test("Response is an array", function() {',
    '   pm.expect(pm.response.json()).to.be.an("array");',
    '});'];
};

const responseContainsId = (response, harRequestUrl) => {
  const id = getIdFromUrl(harRequestUrl);
  return response.content != null && 'text' in response.content && parseInt(JSON.parse(response.content.text).id) === id;
};

const responseIsArray = (response) => {
  return response.content != null && 'text' in response.content && Array.isArray(JSON.parse(response.content.text));
};

const getIdFromUrl = (harRequestUrl) => {
  const harPathnameArray = harRequestUrl.pathname.split('/');
  const lastPathObject = harPathnameArray[harPathnameArray.length - 1];
  return parseInt(lastPathObject);
};

module.exports = HarToPostman;
