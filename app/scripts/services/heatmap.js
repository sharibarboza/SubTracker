'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.heatmap
 * @description
 * # heatmap
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('heatmap', ['moment', function (moment) {
    var dates = {};
    var data;
    var year = moment().year();
    var count = 0;

    /*
     Sets up the data fro the heat map graph.
     Grabs the comments and submissions from a sub and returns an array
     of objects, each object contains: the date, the total amount of 
     posts per date, the total amount of comments per date, and the total
     amount of submissions per date.
    */
    return {
      getSubMap: function(subData, current_year) {
        resetData();
        setYear(current_year);
        data = subData;

        getData('comments', 'sub');
        getData('submissions', 'sub');
        return getDataArray();
      },
      getUserMap: function(subs, current_year) {
        resetData();
        setYear(current_year);

        var keys = Object.keys(subs);

        for (var i = 0; i < keys.length; i++) {
          var subName = keys[i];
          data = subs[subName];

          getData('comments', 'user');
          getData('submissions', 'user');
        }
        return getDataArray();
      },
      getCount: function() {
        return count;
      }
    };

    /*
     Reset the dates for a new sub.
    */
    function resetData() {
      dates = {};
      count = 0;
    }

    function setYear(current_year) {
      if (current_year) {
        year = current_year;
      }
    }

    /*
     Get the array of data objects.
     Each object represents a date during the current year, containing
     post (comments/submissions) activity for that specific date.
    */
    function getDataArray() {
      var dataArray = [];
      for (var data in dates) {
        dataArray.push(dates[data]);
      }
      return dataArray;
    }

    /*
     Primary method for configuring the data array.
     param: where - specifies whether to get comments or submissions.
    */
    function getData(where, type) {
      var dataArray;

      if (where === 'comments') {
        dataArray = data.comments;
      } else {
        dataArray = data.submissions;
      }

      for (var i = 0; i < dataArray.length; i++) {
        var elem = dataArray[i];
        var date = moment(elem.created_utc*1000);
        var commentYear = date.year();
        var dateObj = date.format('YYYY-MM-DD');

        if (year === commentYear) {
          if (type === 'sub') {
            setSubDay(where, dateObj);
          } else {
            setUserDay(where, dateObj, elem);
          }
          count += 1;
        }
      
      }
    }

    function setUserDay(where, dateObj, subData) {
      var dayData;
      var sub = subData.subreddit;

      if (!(dateObj in dates)) {
        dates[dateObj] = {};

        dayData = dates[dateObj];
        dayData.date = dateObj;
        dayData.total = 0;
        dayData.details = [];
        dayData.summary = [];
        dayData.subs = {};
      } else {
        dayData = dates[dateObj];
      }

      if (!(sub in dayData.subs)) {
        dayData.subs[sub] = {
          'comments' : 0,
          'submissions' : 0
        }
        dayData.total += 1;
      }

      if (where === 'comments') {
        dayData.subs[sub].comments += 1;
      } else {
        dayData.subs[sub].submissions += 1;
      }
    }

    function setSubDay(where, dateObj) {
      if (!(dateObj in dates)) {
        dates[dateObj] = {};

        var dayData = dates[dateObj];
        dayData.date = dateObj;
        dayData.total = 0;
        dayData.details = [];
        dayData.summary = [];
        dayData.comments = 0;
        dayData.submissions = 0;
      }

      dates[dateObj].total += 1;
      if (where === 'comments') {
        dates[dateObj].comments += 1;
      } else {
        dates[dateObj].submissions += 1;
      }
    }
  }]);
