'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.recentTimes
 * @description
 * # recentTimes
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('recentTimes', ['subFactory', function (subFactory) {
    var data = {};
    var user;

    /*
     Stores data about a subreddit's most recent post
    */
    var factory = {
      getData: function(username, subreddit, subData) {
        if (username !== user) {
          data = {};
          user = username;
        }

        if (!(subreddit in data)) {
          data[subreddit] = subFactory.getLatestPost(subData);
        }
        return data[subreddit];
      }
    };
    return factory;
  }]);
