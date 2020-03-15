const HarToPostman = () => { };

HarToPostman.createPostmanCollection = (harContent, includeTest = false) => {
  try {
    harContent = JSON.parse(harContent);
  } catch (e) {
    return 'invalid json';
  }
  const postmanContent = {};
  postmanContent.info = generateInfo();
  postmanContent.item = generateItems(harContent, includeTest);
  return JSON.stringify(postmanContent);
};

const generateInfo = () => {
  return {
    name: 'Har2Postman',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  };
};

const generateItems = (harContent, includeTest) => {
  const items = [];
  harContent.log.entries.map( (e) => {
    items.push(generateItem(e, includeTest));
  });
  return items;
};

const generateItem = (harContentEntry, includeTest) => {
  const harRequest = harContentEntry.request;
  const harRequestUrl = new URL(harRequest.url);
  const harResponse = harContentEntry.response;
  const item = {
    name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, includeTest),
    request: generateItemRequest(harRequest),
  };
  if (includeTest) {
    item.event = generateItemEvent(harResponse, harRequestUrl);
  }
  return item;
};

const generateItemName = (method, path, responseCode, includeTest) => {
  let status = '';
  switch (responseCode) {
    case 200:
      status = 'successfully';
      break;
    case 201:
      status = 'created';
      break;
    case 202:
      status = 'accepted';
      break;
    case 204:
      status = 'no-content';
      break;
    case 403:
      status = 'forbidden';
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

const generateItemRequest = (harRequest) => {
  const harRequestUrl = new URL(harRequest.url);
  const itemRequest = {
    method: harRequest.method,
    url: generateItemRequestUrl(harRequestUrl, harRequest.queryString),
    header: generateItemRequestHeaders(harRequest.headers, Boolean(harRequest.bodySize)),
  };
  if (harRequest.bodySize > 0) {
    itemRequest.body = generateItemRequestBody(harRequest.postData);
  }
  if (itemRequest.header.length == 0) {
    delete itemRequest.header;
  }
  return itemRequest;
};

const generateItemRequestUrl = (harRequestUrl, queryString) => {
  const harPathnameArray = harRequestUrl.pathname.split('/');
  const itemRequestUrl = {
    raw: harRequestUrl.toString(),
    protocol: harRequestUrl.protocol.slice(0, -1),
    host: harRequestUrl.hostname.split('.'),
    path: harPathnameArray.slice(1),
  };
  if (queryString.length > 0) {
    itemRequestUrl.query = generateQueryParams(queryString);
  }
  return itemRequestUrl;
};

const generateQueryParams = (queryString) => {
  queryString.forEach((queryParam) => {
    queryParam.key = queryParam.name;
    delete queryParam.name;
  });
  return queryString;
};

const generateItemRequestHeaders = (harRequestHeaders, requestHasBody) => {
  const relevantHarHeaders = [];
  if (requestHasBody) {
    relevantHarHeaders.push('Content-Type');
  }
  return filterAndRenameRelevantHeaders(harRequestHeaders, relevantHarHeaders);
};

const filterAndRenameRelevantHeaders = (harRequestHeaders, relevantHarHeaders) => {
  const itemRequestHeaders = [];
  relevantHarHeaders.map((relevantHeader) => {
    const newItemRequestHeader = harRequestHeaders.find((header) => header.name === relevantHeader);
    if (newItemRequestHeader != undefined) {
      itemRequestHeaders.push(newItemRequestHeader);
    }
  });
  itemRequestHeaders.forEach((header) => {
    header.key = header.name;
    delete header.name;
  });
  return itemRequestHeaders;
};

const generateItemRequestBody = (requestBody) => {
  return {
    mode: 'raw',
    raw: requestBody.text,
    options: {'raw': {'language': 'json'}},
  };
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
  return responseIsJson(response) && parseInt(JSON.parse(response.content.text).id) === id;
};

const responseIsArray = (response) => {
  return responseIsJson(response) && Array.isArray(JSON.parse(response.content.text));
};

const responseIsJson = (response) => {
  return response.content && response.content.text && response.content.mimeType === 'application/json';
};

const getIdFromUrl = (harRequestUrl) => {
  const harPathnameArray = harRequestUrl.pathname.split('/');
  const lastPathObject = harPathnameArray[harPathnameArray.length - 1];
  return parseInt(lastPathObject);
};
