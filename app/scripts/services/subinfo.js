'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subInfo
 * @description
 * # subInfo
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('subInfo', ['$http', function ($http) {

    // Public API here
    return {
      getData: function(sub) {
        var url = "https://api.reddit.com/r/" + sub + "/about.json";
        return $http.get(url).then(function(response) {

          return response.data.data;
        }, function(error) {
          console.log("Error: " + error);
        });
      }
    };
  }]);
