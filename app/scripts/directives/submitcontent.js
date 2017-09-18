'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:submitContent
 * @description
 * # submitContent
 */
angular.module('SubSnoopApp')
  .directive('submitContent', ['$compile', '$filter', function ($compile, $filter) {

    /* Submission posts with no preview images */
    var isLinkedImage = function(submit) {
      return isImage(submit) && !submit.preview;
    };

    /* Submissions posts with a preview image and a link */
    var isAttachedImage = function(submit) {
      return isImage(submit) && submit.preview;
    };

    var isImage = function(submit) {
      return !submit.selftext_html && !submit.html && !submit.media;
    };

    var isImgurAlbum = function(submit) {
      return submit.media && submit.media.oembed && submit.media.oembed.provider_name === "Imgur";
    }

    var isVideo = function(url) {
      if (url) {
        return url.indexOf('gifv') >= 0;
      } else {
        return false;
      }
    };

    /*
     Submitted videos will usually be of .gifv format.
     Stripping and using .gif instead will make the video animated.
    */
    var getVideoUrl = function(url) {
      return url.slice(0, url.length-1);
    };

    /*
     Change width of embedded videos
    */
    var changeSize = function(html) {
      html = html.replace(/width="\d+"/g, 'width="100%"');
      return html;
    };

    /*
     Highlight search terms in text posts for the search page
    */
    var highlightHtml = function(page, html, data) {
      if (page === 'search' && data.highlighted_body) {
        return $filter('sanitize')(data.highlighted_body);
      } else {
        return $filter('sanitize')(html);
      }
    };

    /*
     Get the preview image with medium-size resolution
    */
    var getPreview = function(data) {
      var resolutions = data.preview.images[0].resolutions;
      var index = 3;

      if (resolutions.length <= 3) {
        index = resolutions.length-1;
      }
      return data.preview.images[0].resolutions[index].url;
    }
 
    /*
     Sets up and cleans data for displaying submission content.
     Deals with displaying:
      - Sanitized HTML text posts
      - Attached images, linked images, static/animated gifs
      - Embedded HTML, usually for videos and image albums (imgur)
    */
    return {
      restrict: 'E',
      scope: {
          data: '@'
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function() {
          var data = JSON.parse(attrs.data);
          var page = attrs.page;

          var getTemplate = function(data) {
            if (data.selftext_html) {
              return highlightHtml(page, data.selftext_html, data);
            } else if (data.html) {
              return highlightHtml(page, data.html, data);
            } else if (isLinkedImage(data)) {
              return '<img class="submit-pic" ng-src="' + data.url + '">';
            } else if (data.media && data.media.oembed && data.media.oembed.provider_name != "Imgur") {
              return changeSize($filter('escape')(data.media.oembed.html));
            } else if ('preview' in data && (isAttachedImage(data) || isImgurAlbum(data))) {
              return '<img class="submit-pic" ng-src="' + $filter('escape')(getPreview(data)) + '">';
            } else if (isVideo(data.url)) {
              return '<img class="submit-pic" ng-src="' + getVideoUrl(data.url) + '">';
            } else if ('reddit_video' in data.media && data.media.reddit_video.fallback_url) {
              return '<video width="100%" height="240" class="submit-pic" controls><source src="' + data.media.reddit_video.fallback_url + '" type="video/mp4"></video>';
            } else {
              return '<a href="' + data.url + '" target="_blank">' + data.url + '</a>';
            } 
          };

          element.html(getTemplate(data));
          $compile(element.contents())(scope);
        });
      }
    };
  }]);
