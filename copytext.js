function copyText(element) {

    element.select();

    document.execCommand("copy");

    document.getElementById("copy-text-button").innerHTML = "Copied!";
}
