'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:orderSubs
 * @function
 * @description
 * # orderSubs
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sortSubs', ['moment', '$filter', 'sortFactory', function (moment, $filter, sortFactory) {

    /*
     Used for sorting subreddits
     All sorting of subs are secondarily sorted by sub name. So if two subreddits are equal,
     they will then be sorted alphabetically.
    */

    var sortName = function(keys) {
      keys.sort(function(a, b) {
        return $filter('sortAlpha')(a, b);
      });
      return keys;
    };

    var sortActivity = function(keys, data) {
      keys.sort(function(a, b) {
        var num1 = data[a].count;
        var num2 = data[b].count;
        return $filter('sortNum')(num1, num2, a, b, true, 'alpha');
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
        } else if (where === 'submitted') {
          num1 = getAverage(data[a].submission_ups, data[a].submissions.length);
          num2 = getAverage(data[b].submission_ups, data[b].submissions.length);
        } else {
          num1 = getAverage(data[a].total_ups, data[a].count);
          num2 = getAverage(data[b].total_ups, data[b].count);
        }
        return $filter('sortNum')(num1, num2, a, b, true, 'alpha');
      });
      return keys;
    };

    var sortRecent = function(keys, data) {
      keys.sort(function(a, b) {
        var date1 = $filter('date')(data[a].recent_activity);
        var date2 = $filter('date')(data[b].recent_activity);
        return $filter('sortNum')(date1, date2, a, b, true, 'alpha');
      });
      return keys;
    }

    var sort = function(keys, data, where, reverse) {
      keys.sort(function(a, b) {
        var num1 = data[a][where];
        var num2 = data[b][where];
        return $filter('sortNum')(num1, num2, a, b, reverse, 'alpha');
      });
      return keys;
    };

    return function (input, attribute, subs) {
      var sortedData = {};

      if (sortFactory.isSorted(attribute)) {
        return sortFactory.getSorted(attribute);
      }

      var cloned_keys = [].concat(input);

      if (cloned_keys) {
        if (attribute === 'subName') {
          sortedData = sortName(cloned_keys);
        } else if (attribute === 'totalComments') {
          sortedData = sort(cloned_keys, subs, 'comments', true);
        } else if (attribute === 'totalSubmits') {
          sortedData = sort(cloned_keys, subs, 'submissions', true);
        } else if (attribute === 'totalUps') {
          sortedData = sort(input, subs, 'total_ups', true);
        } else if (attribute === 'lastSeen') {
          sortedData = sortRecent(cloned_keys, subs);
        } else if (attribute === 'mostActive') {
          sortedData = sortActivity(cloned_keys, subs);
        } else if (attribute === 'avgComment') {
          sortedData = sortAverage(cloned_keys, subs, 'comments');
        } else if (attribute === 'avgSubmit') {
          sortedData = sortAverage(cloned_keys, subs, 'submitted');
        } else if (attribute === 'avgPost') {
          sortedData = sortAverage(cloned_keys, subs, 'posts');
        } else if (attribute === 'mostDown') {
          sortedData = sort(cloned_keys, subs, 'total_ups', false);
        }
      }

      sortFactory.addSorted(attribute, sortedData);

      return sortedData;
    };

  }]);
