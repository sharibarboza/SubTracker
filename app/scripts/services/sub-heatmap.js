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
    var data;
    var numMonths = 6;

    var minDate = moment().startOf('day').subtract(numMonths + 1, 'month');
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
        if (user != current_user) {
          resetData();
          user = current_user;
        }
        sub = current_sub;

        if (Object.keys(subMaps).length == 20) {
          clear();
        }

        if (!(current_sub in subMaps)) {
          data = subData;
          subMaps[sub] = {};
          subMaps[sub].count = 0;
          subMaps[sub].data = [];
          subMaps[sub].dates = {};

          getData('comments');
          getData('submissions');
          fillDataArray();
        }

        return subMaps[current_sub].data;
      },
      getAverage: function(s) {
        return (subMaps[s].count / diff).toFixed(0);
      },
      getTotal: function(s) {
        return subMaps[s].count;
      },
      clearData: function() {
        clear();
      }
    };

    /*
     Reset the dates for a new sub.
    */
    function resetData() {
      clear();
      data = null;
    }

    /*
     Clears data
    */
    function clear() {
      for (var key in subMaps) {
        if (subMaps.hasOwnProperty(key)) {
          delete subMaps[key];
        }
      }
    }

    /*
     Get the array of data objects.
     Each object represents a date during the current year, containing
     post (comments/submissions) activity for that specific date.
    */
    function fillDataArray() {
      var dateData = subMaps[sub].dates;
      for (var d in dateData) {
        (subMaps[sub].data).push(dateData[d]);
      }
    }

    /*
     Primary method for configuring the data array.
     param: where - specifies whether to get comments or submissions.
    */
    function getData(where) {
      var dataArray = [];

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
          subMaps[sub].count += 1;
        }
      }
    }

    /*
     Store the data for the day (number of comments and submissions)
     */
    function setSubDay(where, dateObj) {
      var dateData = subMaps[sub].dates;
      if (!(dateObj in dateData)) {
        subMaps[sub].dates[dateObj] = {};

        var dayData = dateData[dateObj];
        dayData.date = dateObj;
        dayData.total = 0;
        dayData.details = [];
        dayData.summary = [];
        dayData.comments = 0;
        dayData.submissions = 0;
      }

      dateData[dateObj].total += 1;
      if (where === 'comments') {
        dateData[dateObj].comments += 1;
      } else {
        dateData[dateObj].submissions += 1;
      }
      subMaps[sub].dates = dateData;
    }
  }]);
