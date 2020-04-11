'use strict';

const BASE_URL = 'https://truestory.one';
const API_PREFIX = '/api';
const API_URLS = {
  'counter_article': '/article/counter',
  'article_data': '/article/data',
  'sites_info': '/info/sites',
};
const APP_URLS = {
  'token': '/token',
  'home': '/home',
  'premium': '/premium'
}

var bgPage = chrome.extension.getBackgroundPage();
var toLoad = [];
var headers = {
  'Content-Type': 'application/json'
}


function loadAll(idx) {
  if (idx >= toLoad.length) {
    return;
  }

  toLoad[idx]().done(function () {
    loadAll(idx + 1);
  });
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


function miscSetup() {
  // Going to Home when clicking the logo.
  $('a#homeLink').attr('href', appUrl('home'));
  // Set-up the premium URL for getting pro when reaching the request limit.
  $('a.premium-link').attr('href', appUrl('premium'));
}


function addHeaders(xhr) {
  for (name in headers) {
    xhr.setRequestHeader(name, headers[name]);
  }
}


function syncPromise(wrapped) {
  return function() {
    var def = $.Deferred();
    wrapped.apply(this, arguments);
    def.resolve();
    return def.promise();
  }
}


$.ajaxSetup({
  beforeSend: addHeaders
});

var syncFuncs = [setUpTabs, tieTabLinks, miscSetup].map(func => syncPromise(func));
toLoad.push(...syncFuncs);
$(function () {
  loadAll(0);
});
