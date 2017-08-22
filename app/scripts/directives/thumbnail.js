'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:thumbnail
 * @description
 * # thumbnail
 */
angular.module('SubSnoopApp')
  .directive('thumbnail', function ($compile) {

    var isUrl = function(string) {
      var index = string.indexOf('http');
      return index >= 0 && index < 5;
    };

    var isThumbnail = function(submit) {
      var types = ['default', 'self', 'nsfw', 'image', 'spoiler'];
      return submit.thumbnail_width > 0 && types.indexOf(submit.thumbnail) === -1 && isUrl(submit.thumbnail);
    };

    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.data = JSON.parse(attrs.data);
        scope.type = scope.data.thumbnail;
        scope.url = scope.data.url;
        
        var getTemplate = function(data, url, type) {
          if (isThumbnail(data)) {
            return '<a href="' + url + '"><img class="thumb" ng-src="' + type + '"></a>';
          } else {
            return '<a href="' + url + '" class="thumb thumb-' + type + '"></a>';
          }
        };

        element.html(getTemplate(scope.data, scope.url, scope.type));
        $compile(element.contents())(scope);
      }
    };
  });
