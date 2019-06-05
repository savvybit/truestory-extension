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
      }).done(function (data) {
        $.each(data.articles, function (_idx, article) {
          displayArticle(article.url);
        });
      }).fail(function (xhr) {
        logApiFailure(xhr);
        $('div#noResults').removeClass('d-none');
      }).always(function () {
        $('div#loadingStatus').addClass('d-none');
      });
    }
  );
}


toLoad.push(getArticles);
