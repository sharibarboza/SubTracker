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
  .filter('orderSubs', function () {

    var sortAlpha = function(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      if (a < b) { return -1; } 
      else if (a > b) { return 1; } 
      else { return 0; }    
    };

    var sortNum = function(num1, num2, a, b, reverse) {
      var val1, val2;

      if (reverse) {
        val1 = -1;
        val2 = 1;
      } else {
        val1 = 1;
        val2 = -1;
      }

      if (num1 < num2) { return val1; } 
      else if (num1 > num2) { return val2; } 
      else { return sortAlpha(a, b); }
    };

    var sortName = function(keys) {
      keys.sort(function(a, b) {
        return sortAlpha(a, b);
      });
      return keys;
    };

    var sortActivity = function(keys, data) {
      keys.sort(function(a, b) {
        var num1 = data[a].comments.length + data[a].submissions.length;
        var num2 = data[b].comments.length + data[b].submissions.length;
        return sortNum(num1, num2, a, b, false);
      });
      return keys;
    };

    var getAverage = function(num1, num2) {
      if (num2 === 0) {
        return 0;
      } else {
        return (num1 / num2);
      }
    }

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
        return sortNum(num1, num2, a, b, false);
      });
      return keys;
    }

    var sort = function(keys, data, where, reverse) {
      keys.sort(function(a, b) {
        var num1 = data[a][where];
        var num2 = data[b][where];
        return sortNum(num1, num2, a, b, reverse);
      });
      return keys;
    };

    return function (input, attribute, subs) {
      var sortedData = {};

      if (input) {
        if (attribute === 'subName') {
          sortedData = sortName(input);
        } else if (attribute === 'totalComments') {
          sortedData = sort(input, subs, 'comments', false);
        } else if (attribute === 'totalSubmits') {
          sortedData = sort(input, subs, 'submissions', false);
        } else if (attribute === 'totalUps') {
          sortedData = sort(input, subs, 'total_ups', false);
        } else if (attribute === 'lastSeen') {
          sortedData = sort(input, subs, 'recent_activity', false);
        } else if (attribute === 'mostActive') {
          sortedData = sortActivity(input, subs);
        } else if (attribute === 'avgComment') {
          sortedData = sortAverage(input, subs, 'comments');
        } else if (attribute === 'avgSubmit') {
          sortedData = sortAverage(input, subs, 'submitted');
        } else if (attribute === 'mostDown') {
          sortedData = sort(input, subs, 'total_ups', true);
        }
      }
      return sortedData;
    };
  });
