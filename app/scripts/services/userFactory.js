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
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var user = "";

    window.userCallback = function(response) {
      user = response.data;
    };

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
      }
    };
  }]);