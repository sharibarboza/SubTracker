'use strict';

/**
 * @ngdoc service
 * @name tractApp.userService
 * @description
 * # userService
 * Service in the tractApp.
 */
 angular.module('tractApp')
 .factory('userFactory', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var userPromise;

    var getUserPromise = function(username) {
      var url = baseUrl+username+'/about.json?'+rawJson;
      userPromise = $http.get(url);
    };

    return {
      setUser: function(username) {
        getUserPromise(username);
      },
      getUser: function() {
        return userPromise;
      }
    };
  }]);
