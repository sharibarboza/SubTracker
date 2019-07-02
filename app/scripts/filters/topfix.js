'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:topfix
 * @function
 * @description
 * # topfix
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('topfix', function () {
    return function () {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('crios') < 0 && ua.indexOf('mobile') > -1) {
        return 'top-fix-safari';
      } else {
        return 'top-fix';
      }
    };
  });
