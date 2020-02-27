function HarToPostman() { };

HarToPostman.createPostmanCollection = function (harContent, generateTest = false) {
    try {
        var harContent = JSON.parse(harContent);
    } catch (e) {
        return 'invalid json';
    }
    var postmanContent = {};
    postmanContent.info = generatePostmanInfo();
    postmanContent.item = generatePostmanItem(harContent, generateTest);
    return JSON.stringify(postmanContent);
};

var generatePostmanInfo = function () {
    return { name: 'Har2Postman', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' };
}

var generatePostmanItem = function (harContent, generateTest) {
    var harRequest = harContent.log.entries[0].request;
    var harRequestUrl = new URL(harRequest.url);
    var harResponse = harContent.log.entries[0].response;
    var harPathnameArray = harRequestUrl.pathname.split('/');
    var itemEvent = generatePostmanItemEvent(harResponse, harPathnameArray[harPathnameArray.length - 1]);
    var item = [{ name: generateItemName(harRequest.method, harRequestUrl.pathname, harResponse.status, generateTest), event: itemEvent, request: { method: harRequest.method, url: { raw: harRequestUrl.toString(), protocol: harRequestUrl.protocol.slice(0, -1), host: harRequestUrl.hostname.split('.'), path: harPathnameArray.slice(1) } } }];
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

var generatePostmanItemEvent = function (response, lastPathObject) {
    var scriptExec = ['pm.test("Status code is ' + response.status + '", function () {', '    pm.response.to.have.status(' + response.status + ');', '});'];
    if (response.content && Number.isInteger(lastPathObject)) {
        scriptExec = ['pm.test("Status code is Fetched object should be the expected one", function () {', '    var jsonData = pm.response.json();    pm.expect(jsonData.id).to.eql(' + lastPathObject + ');', '});'];
    }
    var script = { exec: scriptExec, type: "text/javascript" };
    return [{ listen: "test", script: script }];
}

module.exports = HarToPostman;
