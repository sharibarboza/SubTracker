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
    var username;
    var subs = {};
    var colorData = {'Upvoted' : "#1DB3B0", 'Neutral' : "#5552B3", 'Downvoted' : "#ff6d00"};
    var value2 = '';

    /*
     Construct data for post reaction pie chart (upvoted, downvoted, neutral)
    */
    var factory = {
      setSubData: function(subData, user) {
        if (username === undefined || user !== username) {
          subs = {};
          for (var key in subData) {
            subs[key] = getChartData(subData[key]);
          }
          username = user;
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

    /*
     Set up chart data by getting all posts and calculating percentages
     */
    function getChartData(subData) {
      var reactionData = { 'Upvoted' : 0, 'Neutral' : 0, 'Downvoted' : 0 };
      var chartData = {
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

      if (total === 1) {
        chartData.center.value2 = total + ' post';      
      } else {
        chartData.center.value2 = total + ' posts';
      }

      return chartData;

    };

    /*
     Add the number to the appropriate category
     */
    function addReaction(data, points) {
      if (points < 1) {
        ++data.Downvoted;
      } else if (points === 1) {
        ++data.Neutral;
      } else {
        ++data.Upvoted;
      }
      return data;
    };

    /*
     Get the percentage of the number of posts in the category
     */
    function getPercentages(chartArray, total) {
      for (var i = 0; i < chartArray.length; i++) {
        var percent = chartArray[i].value / total;
        chartArray[i].percent = (percent * 100).toFixed(1);
      }
    };

  });