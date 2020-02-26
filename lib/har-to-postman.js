function HarToPostman() { };

HarToPostman.createPostmanCollection = function (harContent) {
    try {
        var harContent = JSON.parse(harContent);
    } catch (e) {
        return 'invalid json';
    }
    var postmanContent = {};
    postmanContent.info = generatePostmanInfo();
    postmanContent.item = generatePostmanItem(harContent);
    return JSON.stringify(postmanContent);
};

var generatePostmanInfo = function () {
    return { name: 'Har2Postman', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' };
}

var generatePostmanItem = function (harContent) {
    var harRequest = harContent.log.entries[0].request;
    var harRequestUrl = new URL(harRequest.url);
    return [{ name: harRequest.method + ' ' + harRequestUrl.pathname, request: { method: harRequest.method, url: { raw: harRequestUrl.toString(), protocol: harRequestUrl.protocol.slice(0, -1), host: harRequestUrl.hostname.split('.'), path: harRequestUrl.pathname.split('/').slice(1) } } }];
}

module.exports = HarToPostman;