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

    /*
     Sets up the data fro the heat map graph.
     Grabs the comments and submissions from a sub and returns an array
     of objects, each object contains: the date, the total amount of 
     posts per date, the total amount of comments per date, and the total
     amount of submissions per date.
    */
    return {
      getMap: function(subData) {
        resetData();
        data = subData;
        getData('comments');
        getData('submissions');
        return getDataArray();
      }
    };

    /*
     Reset the dates for a new sub.
    */
    function resetData() {
      dates = {};
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
      
      }
    }
  }]);
