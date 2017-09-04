'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.newSubs
 * @description
 * # newSubs
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('newSubs', ['$http', '$sce', function ($http, $sce) {
    var subreddits = [];

    /*
     Custom callback function for JSONP request
    */
    window.newCallback = function(response) {
      var data = response.data.children;

      for (var i = 0; i < data.length; i++) {
        subreddits.push(data[i].data);
      }
    };

    /*
     Request the Reddit API to get the newest subs
    */
    return {
      getData: function (num) {
        subreddits = [];
        var url = 'https://www.reddit.com/subreddits/new/.json?jsonp=newCallback';
        var trustedUrl =  $sce.trustAsResourceUrl(url);
        var promise = $http.jsonp(trustedUrl).then(function() {

        }, function() {
          return subreddits;
        });
        return promise;
      }
    };
  }]);
