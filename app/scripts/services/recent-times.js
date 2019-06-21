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
          clear();
          user = username;
        }

        if (Object.keys(data).length == 20) {
          clear();
        }

        if (!(subreddit in data)) {
          data[subreddit] = subFactory.getLatestPost(subData);
        }
        return data[subreddit];
      },
      clearData: function() {
        clear();
      }
    };
    return factory;

    /*
     Clears data
    */
    function clear() {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          delete data[key];
        }
      }
    }
  }]);
