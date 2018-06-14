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
    var subs = {};
    var colorData = {'Positive' : "#2979ff", 'Neutral' : "#fdd835", 'Negative' : "#f44336"};
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
        return subs[current_sub];
      }
    };
    return factory;

    function getChartData(subData) {     
      var sentiment = new Sentimood();
      var chartData = {};

      var chartArray = [];
      var sentimentData = { 'Positive' : 0, 'Neutral' : 0, 'Negative' : 0 };
      chartData = {
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

      if (total == 1) {
        chartData.center.value2 = total + ' post';      
      } else {
        chartData.center.value2 = total + ' posts';
      }

      return chartData;

    };

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

    function getPercentages(chartArray, total) {
      for (var i = 0; i < chartArray.length; i++) {
        var percent = chartArray[i].value / total;
        chartArray[i].percent = (percent * 100).toFixed(1);
      }
    };

  });