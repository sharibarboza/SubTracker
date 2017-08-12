'use strict';

/**
 * @ngdoc service
 * @name tractApp.sortAlpha
 * @description
 * # sortAlpha
 * Service in the tractApp.
 */
angular.module('tractApp')
  .service('sortAlpha', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      get: function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a < b) { return -1; } 
        else if (a > b) { return 1; } 
        else { return 0; }
      }
    };
  });
