'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.sortAlpha
 * @description
 * # sortAlpha
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('sortAlpha', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var sort = function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();

      if (a < b) { 
        return -1; 
      } else if (a > b) { 
        return 1; 
      } else { 
        return 0; 
      }
    };

    return {
      get: function(a, b) {
        return sort(a, b);
      }
    };

  });
