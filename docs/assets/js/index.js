window.onload = () => {
    document.getElementById('file-input').addEventListener('change', readFile, false);
};

const readFile = (e) => {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    const reader = createReader();
    reader.readAsText(file);
};

const createReader = () => {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        createLink(createJsonFile(createOutputFile(content)));
    };
    return reader;
};

const createOutputFile = (inputFile) => {
    return HarToPostman.createPostmanCollection(inputFile,true);
};

const createJsonFile = (outputFile) => {
    return new Blob([outputFile], {type: 'application/json'});
};

const createLink = (file) => {
    document.getElementById('download').setAttribute('href', window.URL.createObjectURL(file));
    document.getElementById('download').setAttribute('download', 'collection.json');
    document.getElementById('download').style = "display:block;margin-top:3vh";
};
