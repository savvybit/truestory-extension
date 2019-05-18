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


function logApiFailure(xhr) {
  var msg = xhr.responseJSON.message;
  bgPage.console.error('Error ' + xhr.status + ': ' + msg);
}


function apiUrl(name) {
  return BASE_URL + '/api' + API_URLS[name];
}


function openUrl(url) {
  chrome.tabs.create({url: url, active: false});
}


function displayArticle(internalUrl) {
  $.getJSON({
    url: internalUrl
  }).done(function(data) {
    $.get('templates/article.html', function(template) {
      var articleHtml = $(Mustache.render(template, data.article));
      articleHtml.click(function() {
        var link = $(this).find('a.card-link').attr('href');
        openUrl(link);
      });
      $('div#articleList').append(articleHtml);
    });
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
        })
      }).fail(function(xhr) {
        logApiFailure(xhr);
        $('div#noResults').removeClass('d-none');
      }).always(function() {
        $('div#loadingStatus').addClass('d-none');
      });
    }
  );
}


$.ajaxSetup({
  headers: {
    'Authorization': 'Bearer ' + API_TOKEN
  }
});

$(getArticles);
