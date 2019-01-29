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

    /*
     Make an API request to Reddit to fetch the information about a subreddit which includes
     icon, banner, description, creation date, and number of subscribers
     */
    return {
      getData: function(sub) {
        var url = "https://api.reddit.com/r/" + sub + "/about.json";
        return $http.get(url).then(function(response) {
          
          return response.data.data;
        }, function(error) {
          console.log(error);
        });
      }
    };
  }]);
