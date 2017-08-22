'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:redditlink
 * @function
 * @description
 * # redditlink
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('redditlink', function () {
    return function (input) {
      var url = 'http://www.reddit.com';

      input = input.replace('href="/u/', 'href="' + url + '/u/');
      input = input.replace('href="/r/', 'href="' + url + '/r/');
      return input;
    };
  });
