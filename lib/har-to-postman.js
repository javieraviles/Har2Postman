function HarToPostman() { };

HarToPostman.createPostmanCollection = function (harContent,generateTest = false) {
    try {
        var harContent = JSON.parse(harContent);
    } catch (e) {
        return 'invalid json';
    }
    var postmanContent = {};
    postmanContent.info = generatePostmanInfo();
    postmanContent.item = generatePostmanItem(harContent,generateTest);
    return JSON.stringify(postmanContent);
};

var generatePostmanInfo = function () {
    return { name: 'Har2Postman', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' };
}

var generatePostmanItem = function (harContent,generateTest) {
    var harRequest = harContent.log.entries[0].request;
    var harRequestUrl = new URL(harRequest.url);
    var responseCode = harContent.log.entries[0].response.status;
    var itemEvent = generatePostmanItemEvent(harContent,responseCode);
    var item = [{ name: generateItemName (harRequest.method,harRequestUrl.pathname,responseCode,generateTest), event: itemEvent, request: { method: harRequest.method, url: { raw: harRequestUrl.toString(), protocol: harRequestUrl.protocol.slice(0, -1), host: harRequestUrl.hostname.split('.'), path: harRequestUrl.pathname.split('/').slice(1) } } }];
    if(!generateTest){
        delete item[0].event;
    }
    return item;
}

var generateItemName = function(method,path,responseCode,generateTest){
    var status = "";
    switch(responseCode){
    case 200:
        status = "successfully";
        break;
    }
    var itemName = method + ' ' + path;
    if(generateTest){
        itemName += " " + status;
    }
    return itemName;
}

var generatePostmanItemEvent = function (harContent,responseCode) {
    var scriptExec = ['pm.test("Status code is ' + responseCode + '", function () {','    pm.response.to.have.status(' + responseCode +');','});'];
    var script = { exec: scriptExec, type : "text/javascript" };
    return [{listen : "test", script: script }];
}

module.exports = HarToPostman;
