'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.recentTimes
 * @description
 * # recentTimes
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('recentTimes', ['subFactory', 'moment', function (subFactory, moment) {
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
          data[subreddit] = subData.recent_activity.created_utc;
        }
        return data[subreddit];
      },
      recentlyActive: function(subreddit, months) {
        try {
          var latest = moment(data[subreddit] * 1000);
          var diff = moment().diff(latest, 'months', true);
          return diff <= months;
        } catch(e) {
          return false;
        }
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
