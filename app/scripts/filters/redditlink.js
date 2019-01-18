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

    /*
     Links from Reddit that link to users or subs are not preceded by /u/ or /r/
     respectively. If they are not, these links outside the Reddit website will
     not work.
    */
    return function (input) {
      var url = 'https://www.reddit.com';
      var user_link = 'href="/u/';
      var sub_link = 'href="/r/';

      if (input) {
        if (input.indexOf(user_link) >= 0) {
          input = input.replace(/href="\/u\//g, 'href="' + url + '/u/');
        }

        if (input.indexOf(sub_link) >= 0) {
          input = input.replace(/href="\/r\//g, 'href="' + url + '/r/');
        }
      }

      return input;
    };
  });
