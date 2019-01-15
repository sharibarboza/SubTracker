'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:karma
 * @function
 * @description
 * # karma
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('karma', function () {

    /*
     Convert karma number to the thousandth. E.g. 1000 => 1k.
    */
    return function (input) {
      if (input >= 1000 && input < 1000000) {
        input = input / 1000;
        input = input.toFixed(1) + ' k';
      } else if (input >= 1000000) {
        input = input / 1000000;
        input = input.toFixed(1) + ' M';
      } else {
        input = input.toFixed(0);
      }

      return input;
    };
  });
