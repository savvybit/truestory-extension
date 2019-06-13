'use strict';


function displaySources() {
  $.getJSON({
    url: apiUrl('sites_info')
  }).done(function (data) {
    $.each(data.sites, function (_idx, site) {
      $.get({
        url: 'templates/source.html',
        async: false
      }).done(function (template) {
        var sourceHtml = $(Mustache.render(template, site));
        sourceHtml.find('a').click(function () {
          var publisher = $(this).attr('href');
          openUrl(publisher);
        });
        $('#sourceList').append(sourceHtml);
      });
    });
  }).fail(function (xhr) {
    logApiFailure(xhr);
  });
}


function aboutTab() {
  if (!$('#sourceList').find('div').length) {
    displaySources();
  }
}
