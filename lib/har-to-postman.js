const HarToPostman = () => { };

HarToPostman.createPostmanCollection = (harContent, generateTest = false) => {
  try {
    harContent = JSON.parse(harContent);
  } catch (e) {
    return 'invalid json';
  }
  const postmanContent = {};
  postmanContent.info = generateInfo();
  postmanContent.item = generateItem(harContent, generateTest);
  return JSON.stringify(postmanContent);
};

const generateInfo = () => {
  return {
    name: 'Har2Postman',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  };
};

const generateItem = (harContent, generateTest) => {
  const harRequest = harContent.log.entries[0].request;
  const harRequestUrl = new URL(harRequest.url);
  const harPathnameArray = harRequestUrl.pathname.split('/');
  const harResponse = harContent.log.entries[0].response;
  const item = [{
    name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, generateTest),
    event: generateItemEvent(harResponse, harRequestUrl),
    request: {
      method: harRequest.method,
      url: {
        raw: harRequestUrl.toString(),
        protocol: harRequestUrl.protocol.slice(0, -1),
        host: harRequestUrl.hostname.split('.'),
        path: harPathnameArray.slice(1),
      },
    },
  }];
  if (!generateTest) {
    delete item[0].event;
  }
  return item;
};

const generateItemName = (method, path, responseCode, generateTest) => {
  let status = '';
  switch (responseCode) {
    case 200:
      status = 'successfully';
      break;
  }
  let itemName = method + ' ' + path;
  if (generateTest) {
    itemName += ' ' + status;
  }
  return itemName;
};

const generateItemEvent = (response, harRequestUrl) => {
  let scriptExec = generateStatusCodeAssertion(response.status);
  const harPathnameArray = harRequestUrl.pathname.split('/');
  const lastPathObject = harPathnameArray[harPathnameArray.length - 1];
  if (responseContainsId(response, parseInt(lastPathObject))) {
    scriptExec = scriptExec.concat(generateIdAssertion(lastPathObject));
  }
  const script = {
    exec: scriptExec,
    type: 'text/javascript',
  };
  return [{
    listen: 'test',
    script: script,
  }];
};

const generateIdAssertion = (id) => {
  return ['pm.test("Fetched object should be the expected one", function () {',
    '    var jsonData = pm.response.json();', '    pm.expect(jsonData.id).to.eql(' + id + ');',
    '});'];
};

const generateStatusCodeAssertion = (status) => {
  return ['pm.test("Status code is ' + status + '", function () {',
    '    pm.response.to.have.status(' + status + ');',
    '});'];
};

const responseContainsId = (response, id) => {
  return response.content != null && 'text' in response.content && parseInt(JSON.parse(response.content.text).id) === id;
};

module.exports = HarToPostman;
