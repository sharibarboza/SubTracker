'use strict';

/**
 * @ngdoc directive
 * @name tractApp.directive:submitContent
 * @description
 * # submitContent
 */
angular.module('tractApp')
  .directive('submitContent', ['$compile', '$filter', '$sce', function ($compile, $filter, $sce) {

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

    return {
      restrict: 'E',
      scope: {
        data: '@'
      },
      link: function postLink(scope, element, attrs) {
        var data = JSON.parse(attrs.data);

        var getTemplate = function(data) {
          if (data.selftext_html) {
            return $filter('sanitize')(data.selftext_html);
          } else if (data.html) {
            return $filter('sanitize')(data.html);
          } else if (isAttachedImage(data)) {
            return '<img class="submit-pic" ng-src="' + data.preview.images[0].source.url + '">';
          } else if (isLinkedImage(data)) {
            return '<a href="' + data.url +'" target="_blank">' + data.url + '</a><br><img class="submit-pic" ng-src="' + data.url + '">';
          } else if (data.media && data.media.oembed) {
            return data.media.oembed.html;
          } else if (isVideo(data.url)) {
            return '<img class="submit-pic" ng-src="' + getVideoUrl(data.url) + '">';
          }
        };

        element.html(getTemplate(data));
        $compile(element.contents())(scope);
      }
    };
  }]);
