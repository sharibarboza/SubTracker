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

    var sort = function(num1, num2, a, b, reverse, secondary) {
      var val1, val2;

      if (!(secondary)) {
        secondary = 'alpha';
      }

      if (reverse) {
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
    }

    return function (num1, num2, a, b, reverse, secondary) {
      return sort(num1, num2, a, b, reverse, secondary);
    };
  }]);