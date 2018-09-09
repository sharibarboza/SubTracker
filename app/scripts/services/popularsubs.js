'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.popularSubs
 * @description
 * # popularSubs
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('popularSubs', ['$http', '$rootScope', function ($http, $rootScope) {
    var url = "https://api.reddit.com/subreddits.json";
    var subreddits = [];

    /*
     Request the Reddit API to get popular subs
    */
    var factory = {
      getData: function () {
        return $http.get(url).then(function(response) {
          var data;

          data = response.data.data.children;
          var count = data.length;

          for (var i = 0; i < count; i++) {
            subreddits.push(data[i].data);
            var d = [i + 1, count];
            $rootScope.$emit('mainCount', d);
          }
          return subreddits;
        }, function(error) {
          console.log(error);
        });
      }
    };
    return factory;
  }]);
