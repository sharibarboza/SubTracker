'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:sanitize
 * @function
 * @description
 * # sanitize
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sanitize', ['$sanitize', '$filter', function ($sanitize, $filter) {

    return function (input) {

      input = $filter('redditlink')(input);
      return $sanitize($filter('escape')(input));
    };
  }]);
