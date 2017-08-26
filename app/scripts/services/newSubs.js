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

    window.newestCallback = function(response) {
      var data = response.data.children;

      for (var i = 0; i < data.length; i++) {
        subreddits.push(data[i].data);
      }
    };

    return {
      getData: function (num) {
        subreddits = [];
        var url = 'http://www.reddit.com/subreddits/new/.json?jsonp=newestCallback';
        var trustedUrl =  $sce.trustAsResourceUrl(url);
        var promise = $http.jsonp(trustedUrl).then(function() {

        }, function() {
          return subreddits;
        });
        return promise;
      }
    };
  }]);
