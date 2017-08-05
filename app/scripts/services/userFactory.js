'use strict';

/**
 * @ngdoc factory
 * @name tractApp.userFactory
 * @description
 * # userFactory
 * Factory in the tractApp.
 */
 angular.module('tractApp')
 .factory('userFactory', ['$http', function ($http) {
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var userPromise;

    var getUserPromise = function(username) {
      // Make a GET request to reddit API to get user's stats
      var url = baseUrl+username+'/about.json?'+rawJson;
      userPromise = $http.get(url);
    };

    return {
      getUser: function() {
        // Return the promise
        return userPromise;
      },
      setUser: function(username) {
        // Get the promise to fetch data from user's about info
        getUserPromise(username);
      }
    };
  }]);
