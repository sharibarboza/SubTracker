'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:gildWeight
 * @function
 * @description
 * # gildWeight
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('gildWeight', [function () {

    /*
     Get number of gildings (post, gold, platinum)
    */
    return function (input) {
      var num = 0;
      for (var key in input) {
        if (key === 'gid_1') {
          num += (input[key] * 1);
        } else if (key === 'gid_2') {
          num += (input[key] * 2);
        } else if (key === 'gid_3') {
          num += (input[key] * 3);
        }
      }
      return num;
    };
  }]);
