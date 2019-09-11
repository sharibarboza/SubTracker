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
      var num;
      try {
        num = parseInt(input);
      } catch(e) {
        return input;
      }

      if (num >= 1000 && num < 1000000) {
        num = num / 1000;
        num = num.toFixed(1) + 'k';
      } else if (num >= 1000000) {
        num = num / 1000000;
        num = num.toFixed(1) + 'M';
      } else {
        num = num.toFixed(0);
      }

      return num;
    };
  });
