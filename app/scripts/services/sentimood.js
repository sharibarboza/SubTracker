'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.sentiMood
 * @description
 * # sentiMood
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('sentiMood', function () {
    var username;
    var subs = {};
    var colorData = {'Positive' : "#97c9f0", 'Neutral' : "#D6D6D6", 'Negative' : "#f96854"};
    var value2 = '';

    /*
     Constuct data for sentimood pie chart (Positive, Negative, Neutral)
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

        if (!(subName in subs)) {
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
     Use the sentiMood library to generate sentiment analysis scores of a post
     */
    function getChartData(subData) {
      var sentiment = new Sentimood();

      var sentimentData = { 'Positive' : 0, 'Neutral' : 0, 'Negative' : 0 };
      var chartData = {
        center: {}
      };

      var numComments = subData.comments.length;
      for (var i = 0; i < numComments; i++) {
        var comment = subData.comments[i];
        var score = sentiment.analyze(comment.body_html).score;

        sentimentData = addSentiment(sentimentData, score);
      }

      var numSubmits = subData.submissions.length;
      for (var i = 0; i < numSubmits; i++) {
        var submit = subData.submissions[i];
        var score = sentiment.analyze(submit.title).score;

        if (submit.selftext_html) {
          score += sentiment.analyze(submit.selftext_html).score;
        } else if (submit.html) {
          score += sentiment.analyze(submit.html).score;
        }

        sentimentData = addSentiment(sentimentData, score);
      }

      var chartArray = [];
      var sentimentArray = Object.keys(sentimentData);
      for (var i = 0; i < sentimentArray.length; i++) {
        var d = {};
        d.id = i;
        d.label = sentimentArray[i];
        d.value = sentimentData[d.label];
        chartArray.push(d);
      }

      var total = numComments + numSubmits
      getPercentages(chartArray, total);

      chartData.values = chartArray;
      chartData.colors = colorData;
      chartData.center.value = "Post Attitude";

      if (total === 1) {
        chartData.center.value2 = total + ' entry';
      } else {
        chartData.center.value2 = total + ' entries';
      }

      return chartData;

    };

    /*
     Add the number to the appropriate category
     */
    function addSentiment(data, score) {
      if (score < 0) {
        ++data.Negative;
      } else if (score > 0) {
        ++data.Positive;
      } else {
        ++data.Neutral;
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
