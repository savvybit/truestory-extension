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
  var def = $.Deferred();

  var token = inputToken.val();
  if (!token) {
    $.get(appUrl('token')).done(function (data) {
      token = data.trim();
      inputToken.val(token);
      setToken(token);
      def.resolve();
    }).fail(function (xhr) {
      logApiFailure(xhr);
      def.resolve();
    });
  } else {
    setToken(token);
    def.resolve();
  }

  return def.promise();
}


function waitValue(selector, func) {
  if (!selector.val()) {
    return setTimeout(waitValue, 100, selector, func);
  }
  return func();
}


function loadToken() {
  var def = $.Deferred();

  chrome.storage.sync.get('token', function (items) {
    var token = items.token;
    var promise;
    if (token) {
      log('Loaded saved token: ' + token);
      inputToken.val(token);
      promise = waitValue(inputToken, saveToken);
    } else {
      promise = saveToken();
    }
    promise.done(def.resolve);
  });

  return def;
}


inputToken.keyup(function () {
  delay(saveToken, 500);
});

toLoad.unshift(loadToken);
