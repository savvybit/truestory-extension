'use strict';


function articleClick() {
  var link = $(this).find('a.card-link').attr('href');
  openUrl(link);
}


function displayArticle(idx, internalUrl) {
  var def = $.Deferred();

  $.getJSON({
    url: internalUrl
  }).done(function (data) {
    $.get('templates/article.html', function (template) {
      var articleHtml = $(Mustache.render(template, data.article));
      articleHtml.click(articleClick);
      articleHtml.prop('id', idx);
      $('div#articleList').append(articleHtml);
      def.resolve();
    });
  }).fail(function (xhr) {
    logApiFailure(xhr);
    def.resolve();
  });

  return def.promise();
}


function submitArticle(link) {
  showElem('div#loadingStatus');
  hideElem('#tryAgain');

  var data = JSON.stringify({'link': link});
  $.post({
    url: apiUrl('counter_article'),
    data: data,
    dataType: 'json'
  }).done(function () {
    showElem('#tryAgain');
  }).fail(logApiFailure).always(function () {
    hideElem('div#loadingStatus');
  });
}


function getArticles() {
  var def = $.Deferred();
  showElem('div#loadingStatus');
  hideElem('div.article-error');

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
        },
        statusCode: {
          401: function () {
            showElem('div#badToken');
          },
          404: function () {
            showElem('div#noResults');
            submitArticle(tabUrl);
          },
          429: function () {
            showElem('div#limitReached');
          }
        }
      }).done(function (data) {
        var total = data.articles.length;
        var count = 0;
        $.each(data.articles, function (idx, article) {
          displayArticle(idx, article.url).done(function () {
            if (++count >= total) {
              def.resolve();
            }
          });
        });
      }).fail(function (xhr) {
        logApiFailure(xhr);
        def.resolve();
      }).always(function () {
        hideElem('div#loadingStatus');
        hideElem('div.article-error');
      });
    }
  );

  return def.promise();
}


function sortArticles() {
  var articleList = $('div#articleList');
  articleList.find('div.article-body').sort(function (a, b) {
    return parseInt(a.id) - parseInt(b.id);
  }).each(function () {
    var article = $(this);
    article.remove();
    // NOTE(cmiN): Clicking ability is lost when removing and re-appending the article
    //  whilst being sorted.
    article.click(articleClick);
    article.appendTo(articleList);
  });
}


function articlesTab() {
  if (!$('div#articleList').find('div').length) {
    getArticles().done(sortArticles);
  }
}


toLoad.push(articlesTab);
