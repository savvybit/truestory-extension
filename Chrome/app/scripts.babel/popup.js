'use strict';

const BASE_URL = 'https://truestory.one';
const API_URLS = {
  'counter_article': '/article/counter',
  'article_data': '/article/data',
};
const API_TOKEN = 'd897703467a4fe7b958b68426f1721dd';

var bgPage = chrome.extension.getBackgroundPage();


function log(msg) {
  bgPage.console.log(msg);
}


function apiUrl(name) {
  return BASE_URL + '/api' + API_URLS[name];
}


function logApiFailure(xhr) {
  var msg = xhr.responseJSON.message;
  bgPage.console.error('Error ' + xhr.status + ': ' + msg);
}


function displayArticle(internalUrl) {
  $.getJSON({
    url: internalUrl
  }).done(function(data) {
    var articleTemplate = $('div#templates').find(
      'div.article-template').parent().html();
    var articleHtml = Mustache.render(articleTemplate, data.article);
    $('div#articleList').append(articleHtml);
  }).fail(logApiFailure);
}


function getArticles() {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
      currentWindow: true
    },
    function (tabs) {
      var tabUrl = tabs[0].url;

      $.getJSON({
        url: apiUrl('counter_article'),
        data: {
          link: tabUrl
        }
      }).done(function(data) {
        $.each(data.articles, function(idx, article) {
          displayArticle(article.url);
        });
      }).fail(logApiFailure);
    }
  );
}


$.ajaxSetup({
  headers: {
    'Authorization': 'Bearer ' + API_TOKEN
  }
});

$(getArticles);
