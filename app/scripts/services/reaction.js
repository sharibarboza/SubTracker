'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.reaction
 * @description
 * # reaction
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('reaction', ['$filter', function ($filter) {
    var username;
    var subs = {};
    var colorData = {'Upvoted' : "#37AE9B", 'Neutral' : "#D6D6D6", 'Downvoted' : "#f96854"};
    var value2 = '';

    /*
     Construct data for post reaction pie chart (upvoted, downvoted, neutral)
    */
    var factory = {
      setSubData: function(subName, subData, user) {
        if (username === undefined || user !== username) {
          clear();
          username = user;
        }

        if (Object.keys(subs).length == 20) {
          clear();
        }

        if (subData && !(subName in subs)) {
           subs[subName] = getChartData(subData);
        }
      },
      getData: function (current_sub) {
        if (current_sub in subs) {
          return subs[current_sub];
        } else {
          return null;
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
      for (var key in subs) {
        if (subs.hasOwnProperty(key)) {
          delete subs[key];
        }
      }
    }

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

      var totalNum = $filter('number')(total);
      if (total === 1) {
        chartData.center.value2 = totalNum + ' entry';
      } else {
        chartData.center.value2 = totalNum + ' entries';
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

  }]);
