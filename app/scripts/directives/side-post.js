'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:submit
 * @description
 * # sidePost
 */
angular.module('SubSnoopApp')
  .directive('sidePost', function () {
    return {

      /*
       Used for displaying comment or submission posts in the side bars

       On a user's main page, the most recent comments are displayed.
       On a user's sub page, either the top comment or top submission is displayed.
      */
      templateUrl: 'views/side-post.html',
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