'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.pieChart
 * @description
 * # pieChart
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('pieChart', ['subFactory', '$filter', function (subFactory, $filter) {
    var username;
    var type;
    var chartData;

    var colors = ["#80deea", "#FF7817", "#d4e157", "#f50057", "#7e57c2", "#2979ff", "#00c853", "#fdd835", "#FA4E2D", "#9ccc65"];
    var colorData = {};
    var colorIndex = 0;

    var value2 = "Top 5";

    /*
     Construct data for user pie-charts (most active and most upvoted)
    */
    var factory = {
      getData: function (current_user, current_type) {
        if (username != current_user) {
          colorData = {};
          colorIndex = 0;
        }
        
        if (!chartData || username != current_user || type != current_type) {
          username = current_user;
          type = current_type;
          setChartData(current_type);
        } 

        return chartData;
      }
    };
    return factory;

    function setChartData(type) {

      var subs = subFactory.getSubData().subs;
      var chartArray;

      chartData = {};

      if (type === 'activity') {
        chartArray = [];
        chartData = {
          center: {}
        };

        chartData.center.value = "Most Active Subs";
        chartData.center.value2 = value2;

        var sortedSubs = $filter('sortSubs')(Object.keys(subs), 'mostActive', subs);
        var activeArray = sortedSubs.slice(0, 5);
        var total = 0;

        for (var i = 0; i < activeArray.length; i++) {
          var name = activeArray[i];
          var sub = subs[name];
          var posts = sub.comments.length + sub.submissions.length;
          total += posts;

          var d = {};
          d.id = i;
          d.label = name;
          d.value = posts;

          chartArray.push(d);

          if (!(name in colorData)) {
            colorData[name] = colors[colorIndex];
            ++colorIndex;
          }
        }
        getPercentages(chartArray, total);
      } else if (type === 'upvotes') {
        chartArray = [];
        chartData = {
          center: {}
        };

        chartData.center.value = "Most Upvoted Subs";
        chartData.center.value2 = value2;

        var sortedSubs = $filter('sortSubs')(Object.keys(subs), 'totalUps', subs);
        var upvotesArray = sortedSubs.slice(0, 5);
        var total = 0;

        for (var i = 0; i < upvotesArray.length; i++) {
          var name = upvotesArray[i];
          var sub = subs[name];
          var points = sub.comment_ups + sub.submission_ups;
          total += points;

          var d = {};
          d.id = i;
          d.label = name;
          d.value = points;

          chartArray.push(d);

          if (!(name in colorData)) {
            colorData[name] = colors[colorIndex];
            ++colorIndex;
          }
        }
        getPercentages(chartArray, total);
      }
      chartData.values = chartArray;
      chartData.colors = colorData;
    };

    function getPercentages(chartArray, total) {
      for (var i = 0; i < chartArray.length; i++) {
        var percent = chartArray[i].value / total;
        chartArray[i].percent = (percent * 100).toFixed(1);
      }
    };
  }]);