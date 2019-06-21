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
     var userData;

    /*
     Makes a request to the Reddit API to fetch the user's data
    */
    return {
      getData: function (user) {
        var url = 'https://api.reddit.com/user/' + user + '/about.json';
        return $http.get(url).then(function(response) {
          userData = response.data.data;
          return userData;
        }, function(error) {
          return null;
        });
      },
      getUser: function() {
        return userData;
      }
    };
  }]);
