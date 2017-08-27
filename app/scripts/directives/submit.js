'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:submit
 * @description
 * # submit
 */
angular.module('SubSnoopApp')
  .directive('submit', function () {
    return {
      templateUrl: 'views/submit.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.submit = JSON.parse(attrs.data);
        if (scope.submit.type === 'comment') {
          scope.submit.title = scope.submit.link_title;
          scope.submit.url = scope.submit.link_url;
          scope.submit.permalink = scope.submit.link_permalink;
        } else {
          scope.submit.permalink = 'https://www.reddit.com' + scope.submit.permalink;
        }
      }
    };
  });
