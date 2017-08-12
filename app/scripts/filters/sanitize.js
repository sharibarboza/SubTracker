'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:sanitize
 * @function
 * @description
 * # sanitize
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('sanitize', ['$sanitize', '$filter', function ($sanitize, $filter) {
    return function (input) {
      input = $filter('redditlink')(input);
      return $sanitize(input);
    };
  }]);
