window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();
console.log("True story script started23");

let responsesApiArticles = []
let flag_full_capacity = false

let responsesApiArticlesData = []
let flag_full_capacity_data = false
let contorArticole = 0
let cookieOnOff = []
let onExtensionFlag = true

window.onload = function (e) {

    var proxyOnOffButton = new Proxy(cookieOnOff, {
        get: function (target, prop) {
            console.log({ type: 'get', target, prop });
            return Reflect.get(target, prop);
        },
        set: function (target, prop, value) {
            console.log({ type: 'set', target, prop, value });

            if (value.value === 'true' || onExtensionFlag === true) {
                var createCORSRequest = function (method, url) {
                    var xhr = new XMLHttpRequest();
                    if ("withCredentials" in xhr) {
                        // Most browsers.
                        xhr.open(method, url, true);
                    } else if (typeof XDomainRequest != "undefined") {
                        // IE8 & IE9
                        xhr = new XDomainRequest();
                        xhr.open(method, url);
                    } else {
                        // CORS not supported.
                        xhr = null;
                    }
                    return xhr;
                };

                var articles = document.getElementsByTagName('article');
                var articlesList = [];

                if (articles.length !== 0) {
                    lightBoxContent = "	<div id=\"lightbox\">" +
                        "		<div id=\"lightbox_content\">" +
                        "      <div class = \"ceva\">" +
                        "      " +
                        "        <div class=\"navigationTS\">" +
                        "          <i class=\"fa fa-window-close size_img\" aria-hidden=\"true\" id=\"close\"></i>" +
                        "        </div>" +
                        "        <div id = \"first_article_true_story\" class=\"first\">" +
                        "        </div>" +
                        "        <div class=\"border\">" +
                        "        </div>" +
                        "        <div id=\"second_article_true_story\" class=\"second\">" +
                        "        </div>" +
                        "        " +
                        "      </div>" +
                        "    </div>" +
                        "  </div>";

                    document.body.innerHTML += lightBoxContent;

                    document.getElementById('close').addEventListener('click', function () {
                        document.getElementById('lightbox').className = '';
                    });

                    document.getElementById('lightbox').addEventListener('click', function (e) {
                        if (e.target.id == 'lightbox') {
                            document.getElementById('lightbox').className = '';
                        }
                    });

                    logoUrlTrueStory = chrome.extension.getURL('logo-square.png');

                    var a = chrome.extension.getURL("style.css");
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = a;
                    link.type = 'text/css'
                    document.head.appendChild(link);

                    var link_font_awsome = document.createElement('link');
                    link_font_awsome.rel = 'stylesheet';
                    link_font_awsome.href = chrome.extension.getURL("fontawesome/css/all.min.css");
                    link_font_awsome.type = 'text/css';
                    // link_font_awsome.crossOrigin = 'anonymous';
                    // link_font_awsome.referrerPolicy = 'unsafe-url';
                    document.head.appendChild(link_font_awsome);


                }

                for (let i = 0; i < articles.length; i++) {
                    (function () {
                        containerStyle = "right: 0;float: right;margin: 0;position: relative;padding: 0;bottom: 34px;height: 40px;width: 40px;"
                        imageStyle = "height: 30px;display: inline;"


                        articleWidth = articles[i].offsetWidth;
                        addonString = "<div id = \"container_true_story" + i + "\" class = \"container_true_story\" style = \"display:none; width: " + articleWidth + "px;" + containerStyle + " \">" +
                            "<img src = \"" + logoUrlTrueStory + "\" class = \"container_true_story_image\" style = \"" + imageStyle + " \">" +
                            "<div class =\"popup_true_story\">" +
                            "</div>" +
                            "</div>"

                        hashes1 = Array.from(articles[i].getElementsByTagName('h1'))
                        hashes2 = Array.from(articles[i].getElementsByTagName('h2'))
                        hashes3 = Array.from(articles[i].getElementsByTagName('h3'))
                        hashes4 = Array.from(articles[i].getElementsByTagName('h4'))
                        hashes5 = Array.from(articles[i].getElementsByTagName('h5'))
                        hashes6 = Array.from(articles[i].getElementsByTagName('h6'))
                        hashes7 = Array.from(articles[i].getElementsByTagName('h7'))

                        hashes = hashes1.concat(hashes2).concat(hashes3).concat(hashes4).concat(hashes5).concat(hashes6).concat(hashes7)

                        if (hashes.length == 0) {
                            articles[i].innerHTML += addonString;
                        }
                        else {
                            var insertedAddon = false;
                            var min_hash_index = 7;
                            var min_hash_element = null;
                            for (var l = 0; l < hashes.length; l++) {
                                if (hashes[l].className.toLowerCase().includes('headline')) {
                                    insertedAddon = true;
                                    hashes[l].innerHTML += addonString;
                                    break
                                }

                                tagNameNumber = parseInt(hashes[l].tagName.toLowerCase(), 10)
                                if (tagNameNumber < min_hash_index) {
                                    min_hash_index = tagNameNumber;
                                    min_hash_element = hashes[l];
                                }


                            }
                            if (insertedAddon === false) {
                                if (min_hash_element === null) {
                                    hashes[0].innerHTML += addonString;
                                }
                                else {
                                    min_hash_element.innerHTML += addonString;
                                }
                            }
                        }


                        document.getElementById('container_true_story' + i).addEventListener('click', function (e) {
                            document.getElementById('lightbox').className = 'open';
                            document.getElementById('first_article_true_story').innerHTML = "";
                            document.getElementById('second_article_true_story').innerHTML = "";

                            document.getElementById('first_article_true_story').innerHTML += articles[i].innerHTML;
                            
                            var doc = document.getElementById('first_article_true_story').querySelectorAll('#first_article_true_story .container_true_story');
                            for(var h = 0; h < doc.length; h++) {
                                doc[h].remove();
                            }
                            
                            leftArticleImages = document.getElementById('first_article_true_story').getElementsByTagName('img');
                            for (var r = 0; r < leftArticleImages.length; r++) {
                                leftArticleImages[r].setAttribute("style", "width: " + document.getElementById('first_article_true_story').offsetWidth + "px;");
                            }

                            if (articles[i].offsetHeight < 500) {
                                articlesSources = document.getElementById('first_article_true_story').getElementsByTagName('a');
                            } else {
                                articlesSources = [];
                                var ahrefTS = document.createElement('a');
                                ahrefTS.href = window.location.href;
                                articlesSources.push(ahrefTS);
                            }

                            responsesApiArticles = []
                            flag_full_capacity = false

                            var proxy = new Proxy(responsesApiArticles, {
                                apply: function (target, thisArg, argumentsList) {
                                    return thisArg[target].apply(this, argumentList);
                                },
                                deleteProperty: function (target, property) {
                                    return true;
                                },
                                set: function (target, property, value, receiver) {
                                    target[property] = value;
                                    if (proxy.length === articlesSources.length && flag_full_capacity == false) {
                                        flag_full_capacity = true

                                        proxy = Array.from([...new Set(proxy)]);
                                        contorArticole = 0;
                                        for (var p = 0; p < proxy.length; p++) {
                                            responseArticle = proxy[p];
                                            if (responseArticle !== "404" && responseArticle !== undefined) {
                                                var jsonData = JSON.parse(responseArticle);
                                                for (var q = 0; q < jsonData.articles.length; q++) {
                                                    contorArticole++;
                                                }
                                            }
                                        }

                                        var proxyData = new Proxy(responsesApiArticlesData, {
                                            apply: function (target, thisArg, argumentsList) {
                                                return thisArg[target].apply(this, argumentList);
                                            },
                                            deleteProperty: function (target, property) {
                                                return true;
                                            },
                                            set: function (target, property, value, receiver) {
                                                target[property] = value;
                                                if (proxyData.length === contorArticole && flag_full_capacity_data == false) {
                                                    flag_full_capacity_data = true
                                                    //CONSTRUIESC STRINGUL CU ARTICOLE DE APPENDUIT IN JUMATATEA DREAPTA//

                                                    proxyData = Array.from([...new Set(proxyData)]);
                                                    var containerDiv = document.createElement("div");

                                                    var secondArticleCardTS = document.getElementById('second_article_true_story');
                                                    var computedStyle = getComputedStyle(secondArticleCardTS);
                                                    elementHeightPadding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);


                                                    document.getElementById('second_article_true_story').innerHTML += "<h1>Opossed Article:<h1><br></br>";
                                                    var hashesSecond = secondArticleCardTS.getElementsByTagName('h1');
                                                    for (var i = 0; i < hashesSecond.length; i++) {
                                                            elementHeightPadding += hashesSecond[i].offsetHeight;
                                                    }

                                                    elementHeightPadding += 5;

                                                    heightArticleCardTS = (document.getElementsByClassName('ceva')[0].offsetHeight - document.getElementsByClassName('navigationTS')[0].offsetHeight - elementHeightPadding)
                                                    console.log(heightArticleCardTS)
                                                    containerDiv.setAttribute("style", "width: " + document.getElementById('second_article_true_story').offsetWidth + "px;margin: 0 auto;overflow: auto;height: " + heightArticleCardTS +"px;");
                                                    

                                                    for (var t = 0; t < proxyData.length; t++) {
                                                        console.log(proxyData[t])

                                                        articolParsed = proxyData[t].article;
                                                        var containerArticol = document.createElement('div');
                                                        containerArticol.setAttribute("style", "width: " + document.getElementById('second_article_true_story').offsetWidth + "px;box-shadow: 4px 4px 15px 0px rgba(0,0,0,0.75);margin-bottom: 20px;");

                                                        var imageLink = document.createElement('a');
                                                        var imagine = document.createElement('img');
                                                        imagine.src = articolParsed.image;
                                                        imagine.setAttribute("style", "width: " + document.getElementById('second_article_true_story').offsetWidth + "px;");
                                                        imageLink.appendChild(imagine);

                                                        var titlu = document.createElement('h5');
                                                        var sursa = document.createElement('span');


                                                        imageLink.href = articolParsed.link;
                                                        titlu.innerHTML = articolParsed.title;
                                                        sursa.innerHTML = articolParsed.source_name;

                                                        containerArticol.appendChild(imageLink);
                                                        containerArticol.appendChild(titlu);
                                                        containerArticol.appendChild(sursa);

                                                        containerDiv.appendChild(containerArticol);

                                                    }
                                                    console.log(proxyData);
                                                    document.getElementById('second_article_true_story').appendChild(containerDiv);
                                                }
                                                return true;
                                            }
                                        });

                                        for (var p = 0; p < proxy.length; p++) {
                                            responseArticle = proxy[p];
                                            if (responseArticle !== "404" && responseArticle !== undefined) {
                                                var jsonData = JSON.parse(responseArticle);

                                                for (var q = 0; q < jsonData.articles.length; q++) {

                                                    var method = 'GET';
                                                    var url = jsonData.articles[q].url;
                                                    var xhr = createCORSRequest(method, url);

                                                    xhr.onload = function () {
                                                        if (this.readyState == 4 && this.status == 200) {
                                                            proxyData.push(JSON.parse(this.responseText));
                                                        }
                                                        else {
                                                            proxyData.push("404");
                                                        }
                                                    };

                                                    xhr.onerror = function () {
                                                        // Error code goes here.
                                                    };

                                                    xhr.setRequestHeader('Authorization', 'Bearer ' + 'd897703467a4fe7b958b68426f1721dd');
                                                    xhr.send();
                                                }

                                                if (articles[i].offsetHeight > 500) {
                                                    var method = 'GET';
                                                    var url = jsonData.main.url;
                                                    var xhr = createCORSRequest(method, url);

                                                    xhr.onload = function () {
                                                        if (this.readyState == 4 && this.status == 200) {
                                                            
                                                            element = document.getElementById('first_article_true_story')
                                                            var computedStyle = getComputedStyle(element);
                                                            elementHeight = element.clientHeight;  // height with padding
                                                            elementWidth = element.clientWidth;   // width with padding

                                                            elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
                                                            elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

                                                            var containerDiv = document.createElement("div");
                                                            containerDiv.setAttribute("style", "width: " + elementWidth + "px;box-shadow: 4px 4px 15px 0px rgba(0,0,0,0.75);margin: 0 auto;");

                                                            articolParsed = JSON.parse(this.responseText).article;
                                                            var containerArticol = document.createElement('div');
                                                            containerArticol.setAttribute("style", "width: " + elementWidth + "px;");
    
                                                            var imageLink = document.createElement('a');
                                                            imageLink.setAttribute("style", "width: " + elementWidth + "px !important;");
                                                            var imagine = document.createElement('img');
                                                            imagine.src = articolParsed.image;
                                                            imagine.setAttribute("style", "width: 100%" + " !important;");
                                                            imageLink.appendChild(imagine);
    
                                                            var titlu = document.createElement('h3');
                                                            var sursa = document.createElement('span');
    
    
                                                            imageLink.href = articolParsed.link;
                                                            titlu.innerHTML = articolParsed.title;
                                                            sursa.innerHTML = articolParsed.source_name;
    
                                                            containerArticol.appendChild(imageLink);
                                                            containerArticol.appendChild(titlu);
                                                            containerArticol.appendChild(sursa);
    
                                                            containerDiv.appendChild(containerArticol);

                                                            document.getElementById('first_article_true_story').innerHTML = "";
                                                            document.getElementById('first_article_true_story').innerHTML += "<h1>Opossed Articles:<h1><br></br>";
                                                            document.getElementById('first_article_true_story').appendChild(containerDiv);
                                                            //document.getElementById('first_article_true_story').innerHTML = "";
                                                        }
                                                        else {
                                                            proxyData.push("404");
                                                        }
                                                    };

                                                    xhr.onerror = function () {
                                                        // Error code goes here.
                                                    };

                                                    xhr.setRequestHeader('Authorization', 'Bearer ' + 'd897703467a4fe7b958b68426f1721dd');
                                                    xhr.send();
                                                }
                                            }
                                        }
                                    }
                                    return true;
                                }
                            });

                            for (var t = 0; t < articlesSources.length; t++) {
                                var currentSource = articlesSources[t];

                                var method = 'GET';
                                var url = "https://develop-dot-truestory.appspot.com/api/article/counter?link=" + currentSource;
                                var xhr = createCORSRequest(method, url);

                                xhr.onload = function () {
                                    if (this.readyState == 4 && this.status == 200) {
                                        proxy.push(this.responseText);
                                    }
                                    else {
                                        proxy.push("404");
                                    }
                                };

                                xhr.onerror = function () {
                                    // Error code goes here.
                                };

                                xhr.setRequestHeader('Authorization', 'Bearer ' + 'd897703467a4fe7b958b68426f1721dd');
                                xhr.send();
                            }

                        });

                        document.getElementById('container_true_story' + i).parentElement.addEventListener('mouseover', function (e) {
                            var j = i;
                            document.getElementById('container_true_story' + j).style.setProperty('display', "block", "important");
                        });

                        document.getElementById('container_true_story' + i).parentElement.addEventListener('mouseleave', function (e) {
                            var j = i;
                            document.getElementById('container_true_story' + j).style.setProperty('display', "none", "important");
                        });
                    })();
                }
            }

            else if (value.value === 'false') {

                var articles = document.getElementsByTagName('article');
                var articlesList = [];

                for (let i = 0; i < articles.length; i++) {
                    (function () {
                        if(document.getElementById('container_true_story' + i) !== null)
                        {
                            document.getElementById('container_true_story' + i).remove();
                        }
                    })();
                }
            }

            return Reflect.set(target, prop, value);
        }
    });

    browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.command == "requestImages") {
            var images = document.getElementsByTagName('img');
            var imagesList = [];
            for (var i = 0; i < images.length; i++) {
                // if ((images[i].src.toLowerCase().endsWith(".jpg") || images[i].src.toLowerCase().endsWith(".png"))
                //     && (images[i].width > 64 && images[i].height > 64)) {
                imagesList.push({ url: images[i].src, alt: images[i].alt });
                // }
            }
            console.log(images);
            sendResponse(JSON.stringify(imagesList));
        }
        if (request.command == "requestArticles") {
            var articles = document.getElementsByTagName('article');
            var articlesList = [];
            for (var i = 0; i < articles.length; i++) {
                articlesList.push({ innerHTML: articles[i].innerHTML });
            }
            console.log(articles);
            sendResponse(JSON.stringify(articlesList));
        }
        if (request.command == "sendTrueStoryCookie") {
            console.log(request.cookieOnOff);
            if(request.cookieOnOff.value === 'false') 
            {
                onExtensionFlag = false;
            }
            proxyOnOffButton[0] = request.cookieOnOff;
            sendResponse("Thanks");
        }
    });

}



