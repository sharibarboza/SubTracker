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
  .filter('sortSubs', ['moment', '$filter', 'sortFactory', 'subChart', '$routeParams', function (moment, $filter, sortFactory, subChart, $routeParams) {

    /*
     Used for sorting subreddits
     All sorting of subs are secondarily sorted by sub name. So if two subreddits are equal,
     they will usually then be sorted alphabetically.

     keys: refers to an array of strings containing the subreddit names
     data: refers to the dictionary containing all subreddit objects (keys will used to extract the object)
    */

    /*
     Sort subreddits alphabetically
     */
    var sortName = function(keys) {
      keys.sort(function(a, b) {
        return $filter('sortAlpha')(a, b);
      });
      return keys;
    };

    /*
     Sort subreddits numerically by number of posts
     */
    var sortActivity = function(keys, data) {
      keys.sort(function(a, b) {
        var num1 = data[a].count;
        var num2 = data[b].count;
        return $filter('sortNum')(num1, num2, a, b, true, 'alpha');
      });
      return keys;
    };

    /*
     Call the average filter to find average between two numbers
     */
    var getAverage = function(num1, num2) {
      if (num2 === 0) {
        return 0;
      } else {
        return (num1 / num2);
      }
    };

    /*
     Sort subreddits by most recent date
     */
    var sortRecent = function(keys, data) {
      keys.sort(function(a, b) {
        var date1 = $filter('date')(data[a].recent_activity);
        var date2 = $filter('date')(data[b].recent_activity);
        return $filter('sortNum')(date1, date2, a, b, true, 'alpha');
      });
      return keys;
    }

    /*
     Default function for sorting subreddits
     where: must be an attribute of the subreddit object
     reverse: if true, sort by lower value
     */
    var sort = function(keys, data, where, no_reverse) {
      keys.sort(function(a, b) {
        var num1 = data[a][where];
        var num2 = data[b][where];
        return $filter('sortNum')(num1, num2, a, b, no_reverse, 'alpha');
      });
      return keys;
    };

    /*
     Sort subs by most gilded posts
    */
    var sortGilded = function(keys, data) {
      keys.sort(function(a, b) {
        var num1 = $filter('gilded')(data[a].gilds);
        var num2 = $filter('gilded')(data[b].gilds);

        if (num1 == num2) {
          var num1 = $filter('gildWeight')(data[a].gilds);
          var num2 = $filter('gildWeight')(data[b].gilds);
        }

        return $filter('sortNum')(num1, num2, a, b, true, 'alpha');
      });
      return keys;
    }

    /*
     Main function of the filter to sort subreddits
     input: an array of subreddit names (this is the data structure that will be sorted)
     attribute: what to sort on (must be an attribute from the sortOptions in the sortFactory service)
     subs: a dictionary containing all subs and their corresponding data objects
     */
    return function (input, attribute, subs, cached) {
      var sortedData = [];
     /*
      Get the cached sorted list to avoid repeating the sorting process
      */

      if (cached || sortFactory.isSorted(attribute)) {
        var sortedList = sortFactory.getSorted(attribute);
        if (sortedList.length === input.length) {
          return sortedList;
        }
      }

      var cloned_keys = input.slice(0);

      if (cloned_keys) {
        if (attribute === 'subName') {
          sortedData = sortName(cloned_keys);
        } else if (attribute === 'totalComments') {
          sortedData = sort(cloned_keys, subs, 'num_comments', true);
        } else if (attribute === 'totalSubmits') {
          sortedData = sort(cloned_keys, subs, 'num_submissions', true);
        } else if (attribute === 'totalUps') {
          sortedData = sort(input, subs, 'total_ups', true);
        } else if (attribute === 'lastSeen') {
          sortedData = sortRecent(cloned_keys, subs);
        } else if (attribute === 'mostActive') {
          sortedData = sortActivity(cloned_keys, subs);
        } else if (attribute === 'mostDown') {
          sortedData = sort(cloned_keys, subs, 'total_ups', false);
        } else if (attribute === 'mostGilded') {
          sortedData = sortGilded(cloned_keys, subs);
        }
      }

      sortFactory.addSorted(attribute, sortedData);
      return sortedData;
    };

  }]);
