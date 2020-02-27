function HarToPostman() { };

HarToPostman.createPostmanCollection = function (harContent, generateTest = false) {
    try {
        var harContent = JSON.parse(harContent);
    } catch (e) {
        return 'invalid json';
    }
    var postmanContent = {};
    postmanContent.info = generateInfo();
    postmanContent.item = generateItem(harContent, generateTest);
    return JSON.stringify(postmanContent);
};

var generateInfo = function () {
    return { name: 'Har2Postman',
             schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' };
}

var generateItem = function (harContent, generateTest) {
    var harRequest = harContent.log.entries[0].request;
    var harRequestUrl = new URL(harRequest.url);
    var harPathnameArray = harRequestUrl.pathname.split('/');
    var harResponse = harContent.log.entries[0].response;
    var item  = [{ name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, generateTest),
                   event: generatePostmanItemEvent(harResponse,harRequestUrl),
                   request: { method: harRequest.method,
                              url: { raw: harRequestUrl.toString(),
                                     protocol: harRequestUrl.protocol.slice(0, -1),
                                     host: harRequestUrl.hostname.split('.'),
                                     path: harPathnameArray.slice(1) }}}];
    if (!generateTest) {
        delete item[0].event;
    }
    return item;
}

var generateItemName = function (method, path, responseCode, generateTest) {
    var status = "";
    switch (responseCode) {
    case 200:
        status = "successfully";
        break;
    }
    var itemName = method + ' ' + path;
    if (generateTest) {
        itemName += " " + status;
    }
    return itemName;
}

var generatePostmanItemEvent = function (response, harRequestUrl) {
    var scriptExec = generateStatusCodeAssert(response.status);
    var harPathnameArray = harRequestUrl.pathname.split('/');
    var lastPathObject = harPathnameArray[harPathnameArray.length - 1];
    if (responseContainsId(response, parseInt(lastPathObject))) {
        scriptExec = scriptExec.concat(generateIdAssert(lastPathObject));
    }
    var script = { exec: scriptExec,
                   type: "text/javascript" };
    return [{ listen: "test",
              script: script }];
}

var generateIdAssert = function(id){
    return ['pm.test("Fetched object should be the expected one", function () {',
            '    var jsonData = pm.response.json();','    pm.expect(jsonData.id).to.eql(' + id + ');',
            '});'];
}

var generateStatusCodeAssert = function(status){
    return ['pm.test("Status code is ' + status + '", function () {',
            '    pm.response.to.have.status(' + status + ');',
            '});'];
}

var responseContainsId = function (response, id){
    return response.content != null && parseInt(JSON.parse(response.content.text).id) === id;
}

module.exports = HarToPostman;
