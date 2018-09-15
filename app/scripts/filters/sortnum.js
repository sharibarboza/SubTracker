 'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:sortnum
 * @function
 * @description
 * # sortnum
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sortNum', ['$filter', function ($filter) {

    var sort = function(num1, num2, a, b, no_reverse, secondary) {
      var val1, val2;

      if (!(secondary)) {
        secondary = 'alpha';
      }

      if (no_reverse) {
        val1 = 1;
        val2 = -1;
      } else {
        val1 = -1;
        val2 = 1;
      }

      if (num1 < num2) { return val1; }
      else if (num1 > num2) { return val2; }
      else {
        if (secondary === 'alpha') {
          if (typeof a !== 'string' && typeof b !== 'string') {
            a = a.subreddit;
            b = b.subreddit;
          }
          return $filter('sortAlpha')(a, b);
        }
        else if (secondary === 'date') {
          num1 = moment(a.created_utc*1000);
          num2 = moment(b.created_utc*1000);
          return sort(num1, num2, a, b, true, 'alpha');
        }
      }
    };

    /*
     Compare two entities based on numerical values
     num1: First number
     num2: Second number
     a: The entity the first number belongs to (must contain subreddit)
     b: The entity the second number belongs to (must contain subreddit)
     no_reverse: If true, sort by highest number
     secondary: If two entities have the same number, give a secondary attribute to sort on
     */
    return function (num1, num2, a, b, no_reverse, secondary) {
      return sort(num1, num2, a, b, no_reverse, secondary);
    };
  }]);