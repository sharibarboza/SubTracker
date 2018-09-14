 'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:sortalpha
 * @function
 * @description
 * # sortalpha
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sortAlpha', function () {
    return function (a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();

      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    };
  });