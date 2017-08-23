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
      var user_link = 'href="/u/';
      var sub_link = 'href="/r/';

      if (input) {
        if (input.indexOf(user_link) >= 0) {
          input = input.replace(user_link, 'href="' + url + '/u/');
        }

        if (input.indexOf(sub_link) >= 0) {
          input = input.replace(sub_link, 'href="' + url + '/r/');
        }
      }

      return input;
    };
  });
