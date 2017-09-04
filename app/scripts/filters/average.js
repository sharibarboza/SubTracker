'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:average
 * @function
 * @description
 * # average
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('average', function () {
    return function (num, denom, digits) {
      if (parseInt(denom) === 0) {
        return parseInt(denom).toFixed(digits);
      } else {
        var average = (parseInt(num) / parseInt(denom)).toFixed(digits);
        return average !== '-0' ? average : 0
      }
    };
  });
