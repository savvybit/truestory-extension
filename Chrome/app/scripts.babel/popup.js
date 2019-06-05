'use strict';

const BASE_URL = 'https://truestory.one';
const API_URLS = {
  'counter_article': '/article/counter',
  'article_data': '/article/data',
  'sites_info': '/info/sites',
};

var bgPage = chrome.extension.getBackgroundPage();
var toLoad = [];


function loadAll() {
    for (var idx = 0; idx < toLoad.length; ++idx) {
        toLoad[idx]();
    }
}


function log(msg) {
  bgPage.console.log(msg);
}


function logApiFailure(xhr) {
  var msg = xhr.responseJSON.message;
  bgPage.console.error('Error ' + xhr.status + ': ' + msg);
}


function setToken(token) {
  $.ajaxSetup({
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
}


function apiUrl(name) {
  return BASE_URL + '/api' + API_URLS[name];
}


function openUrl(url) {
  chrome.tabs.create({url: url, active: false});
}


function setUpTabs() {
  var tabs = {
    articles: null,
    settings: null,
    about: aboutTab,
  };
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
    var tab = $(event.target);
    var name = tab.attr('id').split('-')[1];
    var func = tabs[name];
    if (func) {
      func();
    }
  });
}


toLoad.push(setUpTabs);
$(loadAll);
