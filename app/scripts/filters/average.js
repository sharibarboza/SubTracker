'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:average
 * @function
 * @description
 * # average
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('average', function () {
    return function (num, denom, digits) {
      if (parseInt(denom) === 0) {
        return parseInt(denom).toFixed(digits);
      } else {
        return (parseInt(num) / parseInt(denom)).toFixed(digits);
      }
    };
  });
