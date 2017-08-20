'use strict';

/**
 * @ngdoc directive
 * @name tractApp.directive:submit
 * @description
 * # submit
 */
angular.module('tractApp')
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
          scope.submit.permalink = 'http://www.reddit.com' + scope.submit.permalink;
        }
      }
    };
  });
