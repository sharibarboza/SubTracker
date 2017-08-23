'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.newSubs
 * @description
 * # newSubs
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('newSubs', ['$http', function ($http) {

    return {
      getData: function (num) {
        var url = 'http://www.reddit.com/subreddits/new/.json?raw_json=1';
        var promise = $http.get(url).then(function(response) {
          var data = response.data.data.children;
          var subreddits = [];

          for (var i = 0; i < num; i++) {
            subreddits.push(data[i].data);
          }
          return subreddits;
        });
        return promise;
      }
    };
  }]);
