function addFile(fileName) {
    var fileType = fileName.split(".");
    fileType[0].splice;
    if (fileType == "css") {
        var linkElement = document.createElement("link");
        linkElement.setAttribute("type", "text/css");
        linkElement.setAttribute("rel", "stylesheet");
        linkElement.setAttribute("href", fileName);
        if (typeof linkElement != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(linkElement);
        }
    }
    else if (fileType == "js") {
        var scriptElement = document.createElement("script");
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("src", fileName);
        if (typeof scriptElement != "undefined") {
            document.getElementsByTagName("body")[0].appendChild(scriptElement);
        }
    }
}