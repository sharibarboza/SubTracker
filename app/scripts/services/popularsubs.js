'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.popularSubs
 * @description
 * # popularSubs
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('popularSubs', ['$http', function ($http) {
    var url = "https://api.reddit.com/subreddits.json";

    /*
     Request the Reddit API to get popular subs
    */
    var factory = {
      getData: function () {
        return $http.get(url).then(function(response) {
          var data, subreddits = [];

          data = response.data.data.children;

          for (var i = 0; i < data.length; i++) {
            subreddits.push(data[i].data);
          }

          return subreddits;
        }, function(error) {
          console.log("Error: " + error);
        });
      }
    };
    return factory;
  }]);
