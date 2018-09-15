'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:sortPosts
 * @function
 * @description
 * # sortPosts
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sortPosts', ['moment', '$filter', function (moment, $filter) {

    /*
     Used for sorting comments/submission posts
    */

    /*
     Reverse = true to sort by most recent date
    */
    var sortDate = function(keys, no_reverse) {
      keys.sort(function(a, b) {
        var num1, num2;
        num1 = moment(a.created_utc*1000);
        num2 = moment(b.created_utc*1000);

        return $filter('sortNum')(num1, num2, a, b, no_reverse, null);
      });
      return keys;
    };

    /*
     Reverse = true to sort by most points
     Secondarily sorted by most recent date, so if a post has the same number of 
     points, the most recent post has precedence.
    */
    var sortPoints = function(keys, no_reverse) {
      keys.sort(function(a, b) {
        return $filter('sortNum')(a.ups, b.ups, a, b, no_reverse, 'date');
      });
      return keys;
    };

    return function (input, attribute) {
      var sortedData = [];

      if (input) {
        if (attribute === 'newest') {
          sortedData = sortDate(input, true);
        } else if (attribute === 'oldest') {
          sortedData = sortDate(input, false);
        } else if (attribute === 'mostUps') {
          sortedData = sortPoints(input, true);
        } else if (attribute === 'mostDowns') {
          sortedData = sortPoints(input, false);
        }
      }
      return sortedData;
    };

  }]);
