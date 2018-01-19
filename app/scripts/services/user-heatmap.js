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

    var year = moment().year();

    /*
     Sets up the data fro the heat map graph.
     Grabs the comments and submissions from a sub and returns an array
     of objects, each object contains: the date, the total amount of 
     posts per date, the total amount of comments per date, and the total
     amount of submissions per date.
    */
    return {
      getUserMap: function(current_user, subs, current_year) {
        if (!dates || user != current_user) {
          resetData();
          setYear(current_year);
          var keys = Object.keys(subs);

          for (var i = 0; i < keys.length; i++) {
            var subName = keys[i];
            data = subs[subName];
            getData('comments');
            getData('submissions');
          }
          fillDataArray();
          user = current_user;
        }
        return dataArray;
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
      data = {};
      count = 0;
      dataArray = [];
    };

    function setYear(current_year) {
      if (current_year) {
        year = current_year;
      }
    };

    /*
     Get the array of data objects.
     Each object represents a date during the current year, containing
     post (comments/submissions) activity for that specific date.
    */
    function fillDataArray() {
      for (var data in dates) {
        dataArray.push(dates[data]);
      }
    };

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
        var commentYear = date.year();
        var dateObj = date.format('YYYY-MM-DD');

        if (year === commentYear) {
          setUserDay(where, dateObj, elem);
          count += 1;
        }
      
      }
    };

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
    };
  }]);
