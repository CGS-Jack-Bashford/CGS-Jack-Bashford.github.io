function copyText(element) {
    var temp = document.createElement("input");
    temp.value = element.innerHTML;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
}

export { copyText };
