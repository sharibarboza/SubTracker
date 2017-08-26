'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.checkStorage
 * @description
 * # checkStorage
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('checkStorage', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      userExists: function(user) {
        return 'user' in sessionStorage && sessionStorage.user.toLowerCase() === user.toLowerCase();
      }
    }
  });
