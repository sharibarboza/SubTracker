'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.userHeatmap
 * @description
 * # userHeatmap
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('userHeatmap', ['moment', function (moment) {

    var user;
    var dates = {};
    var data;
    var count = 0;
    var dataArray = [];
    var subCount = 0;
    var uniqueSubs = {};
    var average = null;

    var minDate = moment().startOf('day').subtract(7, 'month');
    var diff = (moment.duration(moment().diff(minDate)).asMonths()).toFixed(0);

    /*
     Sets up the data for the heat map graph.
     Grabs the comments and submissions from a sub and returns an array
     of objects, each object contains: the date, the total amount of
     posts per date, the total amount of comments per date, and the total
     amount of submissions per date.
    */
    return {
      getUserMap: function(current_user, subs, current_year) {
        if (!dates || user !== current_user) {
          resetData();
          var keys = Object.keys(subs);

          for (var i = 0; i < keys.length; i++) {
            var subName = keys[i];
            data = subs[subName];
            getData('comments');
            getData('submissions');
          }
          fillDataArray();
          calculateAverage();
          user = current_user;
        }
        return dataArray;
      },
      getCount: function() {
        return count;
      },
      getAverage: function() {
        return average;
      },
      clearData: function() {
        resetData();
      }
    };

    /*
     Reset the dates for a new user.
    */
    function resetData() {
      clear(dates);
      clear(data);
      clear(uniqueSubs);
      count = 0;
      dataArray = [];
      subCount = 0;
      average = null;
    };

    /*
     Clears data
    */
    function clear(dataList) {
      for (var key in dataList) {
        if (dataList.hasOwnProperty(key)) {
          delete dataList[key];
        }
      }
    }

    /*
     Get the array of data objects.
     Each object represents a date during the current year, containing
     post (comments/submissions) activity for that specific date.
    */
    function fillDataArray() {
      for (var data in dates) {
        dataArray.push(dates[data]);
      }
    }

    /*
     Calculate the average of unique subreddits per month.
    */
    function calculateAverage() {
      var totalSubs = 0;
      for (var key in uniqueSubs) {
        var subDict = uniqueSubs[key];
        var length = Object.keys(subDict).length;
        totalSubs += length;
      }
      var totalMonths = Object.keys(uniqueSubs).length;
      average = (totalSubs / totalMonths).toFixed(0);
    }

    /*
     Primary method for configuring the data array.
     param: where - specifies whether to get comments or submissions.
    */
    function getData(where) {
      var dataArray;

      if (where === 'comments') {
        dataArray = data.comments;
      } else {
        dataArray = data.submissions;
      }

      for (var i = 0; i < dataArray.length; i++) {
        var elem = dataArray[i];
        var date = moment(elem.created_utc*1000);
        var dateObj = date.format('YYYY-MM-DD');

        if (date >= minDate) {
          setUserDay(where, dateObj, elem);

          var month = date.month();
          if (!(month in uniqueSubs)) {
            uniqueSubs[month] = [];
          }

          if (!(elem.subreddit in uniqueSubs[month])) {
            uniqueSubs[month][elem.subreddit] = null;
          }
        }
      }
    }

    /*
     Set up the data for the day including all the subreddits that had activity
     on that day and the number of comments and submissions posted that day
     */
    function setUserDay(where, dateObj, subData) {
      var dayData;
      var sub = subData.subreddit;

      if (!(dateObj in dates)) {
        dates[dateObj] = {};

        dayData = dates[dateObj];
        dayData.date = dateObj;
        dayData.total = 0;
        dayData.numSubs = 0;
        dayData.details = [];
        dayData.summary = [];
        dayData.subs = {};
        count += 1;
      } else {
        dayData = dates[dateObj];
      }

      if (!(sub in dayData.subs)) {
        dayData.subs[sub] = {
          'comments' : 0,
          'submissions' : 0
        };
        dayData.numSubs += 1;
      }

      if (where === 'comments') {
        dayData.subs[sub].comments += 1;
        dayData.total += 1;
      } else {
        dayData.subs[sub].submissions += 1;
        dayData.total += 1;
      }
    }
  }]);
