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
    
    /*
     Sort data alphabetically
    */

    var service = {
      get: sort
    };
    return service;

    function sort(a, b) {
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

  });
