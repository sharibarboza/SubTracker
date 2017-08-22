'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.userFactory
 * @description
 * # userFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('userFactory', ['$http', function ($http) {
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';

    return {
      getUser: function(username) {
        // Return the promise
        var url = baseUrl+username+'/about.json?'+rawJson;
        var promise = $http.get(url).then(function(response) {
          return response;
        }, function() {
          console.log("User not found.");
        });
        return promise;
      }
    };
  }]);