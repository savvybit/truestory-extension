// TODO: generate those free keys on the web
const COMPUTERVISIONKEY = "";
const BINGSPEECHKEY = "";
window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();
var DareAngel;
(function (DareAngel) {
    class Dashboard {
        constructor(targetDiv) {
            this._imagesList = [];
            this._articlesList = [];
            this._tabIndex = 2;
            this._tabIndex2 = 2;
            this._canUseWebAudio = false;
            this._targetDiv = targetDiv;


            //requestarticles
            browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                // browser.tabs.sendMessage(tabs[0].id, { command: "requestImages" }, (response) => {
                //     if (response !== undefined) {
                //         this._imagesList = JSON.parse(response);
                //         this._imagesList.forEach((element) => {
                //             var newImageHTMLElement = document.createElement("img");
                //             newImageHTMLElement.src = element.url;
                //             newImageHTMLElement.alt = element.alt;
                //             newImageHTMLElement.tabIndex = this._tabIndex;
                //             this._tabIndex++;
                //             newImageHTMLElement.addEventListener("focus", (event) => {
                //                 if (COMPUTERVISIONKEY !== "") {
                //                     this.analyzeThisImage(event.target.src);
                //                 }
                //                 else {
                //                     var warningMsg = document.createElement("div");
                //                     warningMsg.innerHTML = "<h2>Please generate a Computer Vision key in the other tab.</h2>";
                //                     this._targetDiv.insertBefore(warningMsg, this._targetDiv.firstChild);
                //                     browser.tabs.create({ active: false, url: "https://www.microsoft.com/cognitive-services/en-US/sign-up?ReturnUrl=/cognitive-services/en-us/subscriptions?productId=%2fproducts%2f54d873dd5eefd00dc474a0f4" });
                //                 }
                //             });
                //             this._targetDiv.appendChild(newImageHTMLElement);
                //         });
                //     }
                // });

                browser.tabs.sendMessage(tabs[0].id, { command: "requestArticles" }, (response) => {
                    if (response !== undefined) {
                        this._articlesList = JSON.parse(response);
                        this._articlesList.forEach((element) => {
                            var newImageHTMLElement = document.createElement("article");
                            // newImageHTMLElement.src = element.url;
                            // newImageHTMLElement.alt = element.alt;
                            newImageHTMLElement.innerHTML = element.innerHTML;
                            newImageHTMLElement.tabIndex = this._tabIndex2;
                            this._tabIndex2++;
                            this._targetDiv.appendChild(newImageHTMLElement);

                            var childrenImagesOfArticle = newImageHTMLElement.querySelectorAll('img');
                            for(var i=0; i<childrenImagesOfArticle.length; i++) {
                                childrenImagesOfArticle[i].src = childrenImagesOfArticle[i].src.replace('chrome-extension', 'http');
                            }
                            
                        });
                    }
                });

            });
        }
    }
    DareAngel.Dashboard = Dashboard;
})(DareAngel || (DareAngel = {}));
