'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.reaction
 * @description
 * # reaction
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('reaction', function () {
    var subs = {};
    var colorData = {'Upvoted' : "#1DB3B0", 'Neutral' : "#5552B3", 'Downvoted' : "#ff6d00"};
    var value2 = '';

    /*
     Constuct data for sentimood pie chart
    */
    var factory = {
      setSubData: function(subData) {
        subs = {};
        for (var key in subData) {
          subs[key] = getChartData(subData[key]);
        }
      },
      getData: function (current_sub) {
        if (current_sub in subs) {
          return subs[current_sub];
        } else {
          return null;
        }
      }
    };
    return factory;

    function getChartData(subData) {     
      var chartData = {};

      var chartArray = [];
      var reactionData = { 'Upvoted' : 0, 'Neutral' : 0, 'Downvoted' : 0 };
      chartData = {
        center: {}
      };

      var numComments = subData.comments.length;
      for (var i = 0; i < numComments; i++) {
        var comment = subData.comments[i];
        reactionData = addReaction(reactionData, comment.ups);
      }

      var numSubmits = subData.submissions.length;
      for (var i = 0; i < numSubmits; i++) {
        var submit = subData.submissions[i];
        reactionData = addReaction(reactionData, submit.ups);
      }

      var chartArray = [];
      var reactionArray = Object.keys(reactionData);
      for (var i = 0; i < reactionArray.length; i++) {
        var d = {};
        d.id = i;
        d.label = reactionArray[i];
        d.value = reactionData[d.label];
        chartArray.push(d);
      }

      var total = numComments + numSubmits;
      getPercentages(chartArray, total);

      chartData.values = chartArray;
      chartData.colors = colorData;
      chartData.center.value = "Post Reaction";

      if (total == 1) {
        chartData.center.value2 = total + ' post';      
      } else {
        chartData.center.value2 = total + ' posts';
      }

      return chartData;

    };

    function addReaction(data, points) {
      if (points < 1) {
        ++data.Downvoted;
      } else if (points == 1) {
        ++data.Neutral;
      } else {
        ++data.Upvoted;
      }
      return data;
    };

    function getPercentages(chartArray, total) {
      for (var i = 0; i < chartArray.length; i++) {
        var percent = chartArray[i].value / total;
        chartArray[i].percent = (percent * 100).toFixed(1);
      }
    };

  });