'use strict';


function displayArticle(internalUrl) {
  $.getJSON({
    url: internalUrl
  }).done(function (data) {
    $.get('templates/article.html', function (template) {
      var articleHtml = $(Mustache.render(template, data.article));
      articleHtml.click(function () {
        var link = $(this).find('a.card-link').attr('href');
        openUrl(link);
      });
      $('div#articleList').append(articleHtml);
    });
  }).fail(logApiFailure);
}


function getArticles() {
  $('div#loadingStatus').removeClass('d-none');
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
            $('div#badToken').removeClass('d-none');
          },
          404: function () {
            $('div#noResults').removeClass('d-none');
          }
        }
      }).done(function (data) {
        $.each(data.articles, function (_idx, article) {
          displayArticle(article.url);
        });
      }).fail(function (xhr) {
        logApiFailure(xhr);
      }).always(function () {
        $('div#loadingStatus').addClass('d-none');
        $('div.article-error').addClass('d-none');
      });
    }
  );
}


function articlesTab() {
  if (!$('div#articleList').find('div').length) {
    getArticles();
  }
}


toLoad.push(articlesTab);
