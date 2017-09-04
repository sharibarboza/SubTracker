'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.userFactory
 * @description
 * # userFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('userFactory', ['$http', '$sce', function ($http, $sce) {
    var baseUrl = 'https://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var user = "";

    /*
     Custom callback method for JSONP request
    */
    window.userCallback = function(response) {
      user = response.data;
    };

    /*
     Makes a request to the Reddit API to fetch the user's data
    */
    return {
      getData: function(username) {
        // Return the promise
        user = "";
        var url = baseUrl+username+'/about.json?jsonp=userCallback';
        var trustedUrl =  $sce.trustAsResourceUrl(url);
        var promise = $http.jsonp(trustedUrl).then(function() {

        }, function() {
          return user;
        });
        return promise;
      },
      getUser: function() {
        return user;
      }
    };
  }]);