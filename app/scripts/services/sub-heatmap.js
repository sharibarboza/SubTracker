'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subHeatmap
 * @description
 * # subHeatmap
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('subHeatmap', ['moment', function (moment) {

    var user;
    var sub;
    var subMaps = {};

    var dates = {};
    var data;
    var count = 0;
    var dataArray = [];

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
      getSubMap: function(current_user, current_sub, subData, current_year) {
        if (!dates || user != current_user || !(current_sub in subMaps)) {
          resetData();
          data = subData;

          getData('comments');
          getData('submissions');
          fillDataArray();

          user = current_user;
          sub = current_sub;

          subMaps[current_sub] = dataArray;
        }
        return subMaps[current_sub];
      },
      getCount: function() {
        return count;
      },
      getAverage: function() {
        return (count / diff).toFixed(0);
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
      subMaps = {};
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
          setSubDay(where, dateObj);
          count += 1;
        }
      }
    }

    /*
     Store the data for the day (number of comments and submissions)
     */
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
