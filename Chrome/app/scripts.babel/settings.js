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


function setToken(token) {
  $.ajaxSetup({
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
}


function saveToken() {
  if (!inputToken.val()) {
    inputToken.val(API_TOKEN);
  }
  var value = inputToken.val();
  chrome.storage.sync.set({'token': value}, function () {
    log('Set new token as: ' + value);
  });
  setToken(value);
  $('#savedText').removeClass('d-none').fadeOut({
    complete: function () {
      $(this).addClass('d-none').fadeIn();
    }
  });
}


function waitValue(selector, func) {
  if (!selector.val()) {
    return setTimeout(waitValue, 100, selector, func);
  }
  func();
}


function loadToken() {
  chrome.storage.sync.get('token', function (items) {
    var value = items.token;
    if (value) {
      log('Loaded saved token: ' + value);
      inputToken.val(value);
      waitValue(inputToken, saveToken);
    } else {
      saveToken();
    }
  });
}


inputToken.keyup(function () {
  delay(saveToken, 500);
});
loadToken();
