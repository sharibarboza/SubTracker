'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:submitContent
 * @description
 * # submitContent
 */
angular.module('SubSnoopApp')
  .directive('submitContent', ['$compile', '$filter', function ($compile, $filter) {

    var isLinkedImage = function(submit) {
      return isImage(submit) && !submit.preview;
    };

    var isAttachedImage = function(submit) {
      return isImage(submit) && submit.preview;
    };

    var isImage = function(submit) {
      return !submit.selftext_html && !submit.html && !isVideo(submit.url) && !submit.media;
    };

    var isVideo = function(url) {
      if (url) {
        return url.indexOf('gifv') >= 0;
      } else {
        return false;
      }
    };

    var getVideoUrl = function(url) {
      return url.slice(0, url.length-1);
    };

    var changeSize = function(html) {
      html = html.replace(/width="\d+"/g, 'width="100%"');
      return html;
    }
 
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var data = JSON.parse(attrs.data);

        var getTemplate = function(data) {
          if (data.selftext_html) {
            return $filter('sanitize')(data.selftext_html);
          } else if (data.html) {
            return $filter('sanitize')(data.html);
          } else if (isLinkedImage(data)) {
            return '<a href="' + data.url +'" target="_blank">' + data.url + '</a><br><img class="submit-pic" ng-src="' + data.url + '">';
          } else if (isAttachedImage(data)) {
            return '<img class="submit-pic" ng-src="' + data.preview.images[0].source.url + '">';
          } else if (data.media && data.media.oembed) {
            return changeSize($filter('escape')(data.media.oembed.html));
          } else if (isVideo(data.url)) {
            return '<img class="submit-pic" ng-src="' + getVideoUrl(data.url) + '">';
          } else if (data.media.reddit_video.fallback_url) {
            return '<video width="100%" height="240" class="submit-pic" controls><source src="' + data.media.reddit_video.fallback_url + '" type="video/mp4"></video>';
          } 
        };

        element.html(getTemplate(data));
        $compile(element.contents())(scope);
      }
    };
  }]);
