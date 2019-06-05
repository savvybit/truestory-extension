'use strict';

const API_TOKEN = 'd897703467a4fe7b958b68426f1721dd';

var inputToken = $('input#token');
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();


function saveToken() {
  if (!inputToken.val()) {
    inputToken.val(API_TOKEN);
  }
  setToken(inputToken.val());
  $('#savedText').removeClass('d-none').fadeOut({
    complete: function () {
      $(this).addClass('d-none').fadeIn();
    }
  });
}


inputToken.keyup(function () {
  delay(saveToken, 500);
});
saveToken();
