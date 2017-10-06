'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:username
 * @function
 * @description
 * # username
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('username', function () {
    return function (input) {
      return input.split('/')[1];
    };
  });
