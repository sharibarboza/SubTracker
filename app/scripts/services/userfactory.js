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

    /*
     Makes a request to the Reddit API to fetch the user's data
    */
    return {
      getData: function (user) {
        var url = 'https://api.reddit.com/user/' + user + '/about.json';
        return $http.get(url).then(function(response) {
          return response.data.data;
        }, function(error) {
          console.log(error);
        });
      }
    };
  }]);