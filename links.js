function loadFile(name, type){
    if (type == "js"){
        var file = document.createElement("script")
        file.setAttribute("type","text/javascript")
        file.setAttribute("src", name)
    }
    else if (type == "css"){
      var file = document.createElement("link")
      file.setAttribute("rel", "stylesheet")
      file.setAttribute("type", "text/css")
      file.setAttribute("href", name)
    }
    if (typeof file != "undefined"){
      document.getElementsByTagName("head")[0].appendChild(file) //7
    }
}

//CSS
// loadFile("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css", "css"); //Animate.css
// loadFile("https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css", "css");     //Bulma
// loadFile("https://use.fontawesome.com/releases/v5.2.0/css/all.css", "css");                  //Font Awesome
// loadFile("index.css", "css");                                                                //Main CSS
// loadFile("background.css", "css");                                                           //Background Animation CSS

//JavaScript
// loadFile("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", "js");          //jQuery
// loadFile("https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.js", "js");                   //Wow.js
// loadFile("typewrite.js", "js");                                                              //Typewriting JS
// loadFile("smoothscroll.js", "js");                                                           //Smooth Scrolling JS
// loadFile("copytext.js", "js");                                                               //Copy to clipboard JS
// loadFile("stack.js", "js");
