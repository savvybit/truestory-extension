'use strict';

var inputToken = $('input#token');
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();


function setToken(token) {
  chrome.storage.sync.set({'token': token}, function () {
    log('Set new token as: ' + token);
  });

  showElem('#savedText').fadeOut({
    complete: function () {
      hideElem(this).fadeIn();
    }
  });
  headers['Authorization'] = 'Bearer ' + token;
}


function saveToken() {
  var token = inputToken.val();
  if (!token) {
    $.get(appUrl('token')).done(function (data) {
      token = data.trim();
      inputToken.val(token);
      setToken(token);
    }).fail(logApiFailure);
  } else {
    setToken(token);
  }
}


function waitValue(selector, func) {
  if (!selector.val()) {
    return setTimeout(waitValue, 100, selector, func);
  }
  func();
}


function loadToken() {
  chrome.storage.sync.get('token', function (items) {
    var token = items.token;
    if (token) {
      log('Loaded saved token: ' + token);
      inputToken.val(token);
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
