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
  .filter('sanitize', ['$sanitize', function ($sanitize) {
    return function (input) {
      return $sanitize(input);
    };
  }]);
