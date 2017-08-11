'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:redditlink
 * @function
 * @description
 * # redditlink
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('redditlink', function () {
    return function (input) {
      var url = 'http://www.reddit.com';

      input = input.replace('href="/u/', 'href="' + url + '/u/');
      input = input.replace('href="/r/', 'href="' + url + '/r/');
      return input;
    };
  });
