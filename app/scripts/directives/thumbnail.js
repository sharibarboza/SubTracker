'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:thumbnail
 * @description
 * # thumbnail
 */
angular.module('SubSnoopApp')
  .directive('thumbnail', ['$compile', '$window', function ($compile, $window) {

    var windowWidth = $window.innerWidth;

    /*
     Thumbnail is an attached image
    */
    var isUrl = function(string) {
      var index = string.indexOf('http');
      return index >= 0 && index < 5;
    };

    /*
     Thumbnail is one of reddit's default thumbnails
    */
    var isThumbnail = function(submit) {
      var types = ['default', 'self', 'nsfw', 'image', 'spoiler'];
      return submit.thumbnail_width > 0 && types.indexOf(submit.thumbnail) === -1 && isUrl(submit.thumbnail);
    };

    /*
     Prepares and wraps thumbnail in a link for display.
     Default thumbnails are not displayed as images but as backgrounds.
    */
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.data = JSON.parse(attrs.data);
        scope.type = scope.data.thumbnail;
        scope.url = scope.data.url;
        var page = attrs.page;

        var getTemplate = function(data, url, type) {
          if (isThumbnail(data)) {
            return '<img class="thumb thumb-pic" lazy-img="' + type + '">';
          } else if (page == 'sub' && windowWidth >= 768) {
            return '<div class="thumb thumb-' + type + '"></div>';
          } else {
            return '<div class="thumb thumb-beta-' + type + '"></div>';
          }
        };

        element.html(getTemplate(scope.data, scope.url, scope.type));
        $compile(element.contents())(scope);
      }
    };
  }]);
