function loadjscssfile(filename, filetype){
    if (filetype=="js"){
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){
      var fileref=document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined"){
      document.getElementsByTagName("head")[0].appendChild(fileref) //7
    }
}

//CSS
loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css", "css");
loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css", "css");
loadjscssfile("Site/CSS/index.css", "css");
loadjscssfile("Site/CSS/highlight-js.css", "css");
loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css", "css");

//JavaScript
loadjscssfile("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", "js");
loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.js", "js");
loadjscssfile("Site/JavaScript/typewrite.js", "js");
loadjscssfile("Site/JavaScript/smoothscroll.js", "js");
loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js", "js");
