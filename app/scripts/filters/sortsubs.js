'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:orderSubs
 * @function
 * @description
 * # orderSubs
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('sortSubs', ['sortAlpha', 'sortNum', function (sortAlpha, sortNum) {

    var sortName = function(keys) {
      keys.sort(function(a, b) {
        return sortAlpha.get(a, b);
      });
      return keys;
    };

    var sortActivity = function(keys, data) {
      keys.sort(function(a, b) {
        var num1 = data[a].comments.length + data[a].submissions.length;
        var num2 = data[b].comments.length + data[b].submissions.length;
        return sortNum.get(num1, num2, a, b, true, 'alpha');
      });
      return keys;
    };

    var getAverage = function(num1, num2) {
      if (num2 === 0) {
        return 0;
      } else {
        return (num1 / num2);
      }
    };

    var sortAverage = function(keys, data, where) {
      keys.sort(function(a, b) {
        var num1, num2;
        if (where === 'comments') {
          num1 = getAverage(data[a].comment_ups, data[a].comments.length);
          num2 = getAverage(data[b].comment_ups, data[b].comments.length);
        } else {
          num1 = getAverage(data[a].submitted_ups, data[a].submissions.length);
          num2 = getAverage(data[b].submitted_ups, data[b].submissions.length);
        }
        return sortNum.get(num1, num2, a, b, true, 'alpha');
      });
      return keys;
    };

    var sort = function(keys, data, where, reverse) {
      keys.sort(function(a, b) {
        var num1 = data[a][where];
        var num2 = data[b][where];
        return sortNum.get(num1, num2, a, b, reverse, 'alpha');
      });
      return keys;
    };

    return function (input, attribute, subs) {
      var sortedData = {};

      if (input) {
        if (attribute === 'subName') {
          sortedData = sortName(input);
        } else if (attribute === 'totalComments') {
          sortedData = sort(input, subs, 'comments', true);
        } else if (attribute === 'totalSubmits') {
          sortedData = sort(input, subs, 'submissions', true);
        } else if (attribute === 'totalUps') {
          sortedData = sort(input, subs, 'total_ups', true);
        } else if (attribute === 'lastSeen') {
          sortedData = sort(input, subs, 'recent_activity', true);
        } else if (attribute === 'mostActive') {
          sortedData = sortActivity(input, subs);
        } else if (attribute === 'avgComment') {
          sortedData = sortAverage(input, subs, 'comments');
        } else if (attribute === 'avgSubmit') {
          sortedData = sortAverage(input, subs, 'submitted');
        } else if (attribute === 'mostDown') {
          sortedData = sort(input, subs, 'total_ups', false);
        }
      }
      return sortedData;
    };
  }]);
