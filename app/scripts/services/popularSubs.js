'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.popularSubs
 * @description
 * # popularSubs
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('popularSubs', ['$http', '$sce', function ($http, $sce) {
    var subreddits = [];

    window.popCallback = function(response) {
      var data = response.data.children;

      for (var i = 0; i < data.length; i++) {
        subreddits.push(data[i].data);
      }
    };

    return {
      getData: function () {
        subreddits = [];
        var url = 'https://www.reddit.com/subreddits/.json?jsonp=popCallback';
        var trustedUrl =  $sce.trustAsResourceUrl(url);
        var promise = $http.jsonp(trustedUrl).then(function() {

        }, function() {
          return subreddits;
        });
        return promise;
      }
    };
  }]);
