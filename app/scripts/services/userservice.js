'use strict';

/**
 * @ngdoc service
 * @name tractApp.userService
 * @description
 * # userService
 * Service in the tractApp.
 */
 angular.module('tractApp')
 .service('userService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';

    var getUserPromise = function(username) {
      var url = baseUrl+username+'/about.json?'+rawJson;
      return $http.get(url);
    };

    var getCommentPromise = function(username, after) {
      var url = baseUrl+username+'/comments.json?'+rawJson+'&after='+after+'&limit=100';
      return $http.get(url);
    };

    var getSubmitPromise = function(username, after) {
      var url = baseUrl+username+'/submitted.json?'+rawJson+'&after='+after+'&limit=100';
      return $http.get(url);
    };

    return {
      getAbout: function(username) {
        return getUserPromise(username);
      },
      getComments: function(username, after) {
        if (after === 'first') {
          return getCommentPromise(username, 0);
        } else {
          return getCommentPromise(username, after);
        }
      },
      getSubmitted: function(username, after) {
        if (after === 'first') {
          return getSubmitPromise(username, 0);
        } else {
          return getSubmitPromise(username, after);
        }
      }
    };
  }]);
