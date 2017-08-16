'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:truncate
 * @function
 * @description
 * # truncate
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('truncate', function () {
    return function (input) {
      var num = 50;
      var split = input.split(' ');
      var truncated_input = split.slice(0, num);

      if (split.length > num) {
        truncated_input.push('...');
      }
      return truncated_input.join(' ').toString();
    };
  });
