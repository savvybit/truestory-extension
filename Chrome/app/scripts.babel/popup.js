'use strict';

const BASE_URL = 'https://truestory.one';
const API_PREFIX = '/api';
const API_URLS = {
  'counter_article': '/article/counter',
  'article_data': '/article/data',
  'sites_info': '/info/sites',
};
const APP_URLS = {
  'token': '/token'
}

var bgPage = chrome.extension.getBackgroundPage();
var toLoad = [];
var headers = {
  'Content-Type': 'application/json'
}


function loadAll() {
    for (var idx = 0; idx < toLoad.length; ++idx) {
        toLoad[idx]();
    }
}


function showElem(selector) {
  return $(selector).removeClass('d-none');
}


function hideElem(selector) {
  return $(selector).addClass('d-none');
}


function log(msg) {
  bgPage.console.log(msg);
}


function logApiFailure(xhr) {
  var msg = xhr.responseJSON.message;
  bgPage.console.error('Error ' + xhr.status + ': ' + msg);
}


function apiUrl(name) {
  return BASE_URL + API_PREFIX + API_URLS[name];
}


function appUrl(name) {
  return BASE_URL + APP_URLS[name];
}


function openUrl(url) {
  chrome.tabs.create({url: url, active: false});
}


function setUpTabs() {
  var tabs = {
    articles: articlesTab,
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


function tieTabLinks() {
  $('a.tab-link').click(function () {
    var tabAddress = $(this).attr('href');
    var tab = $('nav').find('a' + tabAddress + '-tab');
    if (tab.hasClass('active')) {
      tab.trigger('shown.bs.tab');
    } else {
      tab.click();
    }
  });
}


function addHeaders(xhr) {
  for (name in headers) {
    xhr.setRequestHeader(name, headers[name]);
  }
}


$.ajaxSetup({
  beforeSend: addHeaders
});

toLoad.push(setUpTabs, tieTabLinks);
$(loadAll);
