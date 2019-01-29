'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:gilded
 * @function
 * @description
 * # gilded
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('gilded', ['moment', function (moment) {

    /*
     Get number of gildings (post, gold, platinum)
    */
    return function (input) {
      var num = 0;
      for (var key in input) {
        num += input[key];
      }
      return num;
    };
  }]);
