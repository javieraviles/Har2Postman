function HarToPostman () { };

HarToPostman.convert = function (harContent) {
    
    try {
        var harContent = JSON.parse(harContent);
    } catch(e) {
        return 'invalid json';
    }
    var postmanContent = { info: { _postman_id: "59d18012-c522-4cfd-a21d-3b7e79749e2f", name: "Har2Postman", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" } };
    console.log(JSON.stringify(postmanContent));
    return JSON.stringify(postmanContent);
};

module.exports = HarToPostman;