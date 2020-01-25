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
  $('div#loadingStatus').removeClass('d-none');
  $('#tryAgain').addClass('d-none');

  var data = JSON.stringify({'link': link});
  $.post({
    url: apiUrl('counter_article'),
    data: data,
    dataType: 'json'
  }).done(function () {
    $('#tryAgain').removeClass('d-none');
  }).fail(logApiFailure).always(function () {
    $('div#loadingStatus').addClass('d-none');
  });
}


function getArticles() {
  var def = $.Deferred();
  $('div#loadingStatus').removeClass('d-none');
  $('div.article-error').addClass('d-none');

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
            submitArticle(tabUrl);
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
        $('div#loadingStatus').addClass('d-none');
        $('div.article-error').addClass('d-none');
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
