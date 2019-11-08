'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.filterPosts
 * @description
 * # filterPosts
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('filterPosts', ['moment', '$filter', 'gilded', function (moment, $filter, gilded) {

    /*
     Contains all the categories to sort subreddits and to sort posts
     */

    var filterPosts = {
      sortOptions: [
        {value: 'all', name: 'All Time'},
        {value: 'hour', name: 'Last Hour'},
        {value: 'day', name: 'Last Day'},
        {value: 'week', name: 'Last Week'},
        {value: 'month', name: 'Last Month'},
        {value: 'year', name: 'Last Year'}
      ]
    };

    var limits = {
      'hour': moment().subtract(1, 'hour'),
      'day': moment().subtract(1, 'day'),
      'week': moment().subtract(1, 'week'),
      'month': moment().subtract(1, 'month'),
      'year': moment().subtract(1, 'year')
    }

    // The default value for sorting subreddits (totalUps - subreddits with the most points)
    var defaultFilter = filterPosts.sortOptions[0];

    // The current sorting value of the subreddits
    var currentFilter = defaultFilter;

    // Cache lists for each subreddit and each time category
    var filteredLists = {};
    var numListsCached = 0;

    var factory = {
      clearFiltered: function() {
        clear(filteredLists);
        numListsCached = 0;
      },
      getDefaultFilter: function() {
        return defaultFilter;
      },
      getOptions: function() {
        return filterPosts;
      },
      setFilter: function(filter) {
        currentFilter = filter;
      },
      getFilter: function() {
        return currentFilter;
      },
      getLength: function(subreddit, where, filter, sort) {
        if (checkExists(subreddit, where, filter)) {
          return filteredLists[subreddit][where][filter][sort].length;
        } else {
          return 0;
        }
      },
      ifExists: function(subreddit, filter, where) {
        return checkExists(subreddit, where, filter);
      },
      getExistingData: function(subreddit, filter, where, sort, limit) {
        if (checkExists(subreddit, where, filter, sort)) {
          var entries = filteredLists[subreddit][where][filter][sort];
          return entries.slice(0, limit);
        }
        var filteredObj = filteredLists[subreddit][where][filter];
        var firstKey = Object.keys(filteredObj)[0];
        var dataList = filteredObj[firstKey];

        var sortedList = $filter('sortPosts')(dataList, sort, subreddit, where);
        addFiltered(filter, subreddit, sort, where, sortedList);

        return sortedList.slice(0, limit);
      },
      getData: function(data, filter, subreddit, sort, where, limit) {
        var dataList = filterData(data, where, filter);

        var sortedList = $filter('sortPosts')(dataList, sort, subreddit, where);
        addFiltered(filter, subreddit, sort, where, sortedList);

        return sortedList.slice(0, limit);
      },
      getPoints: function(subreddit, where, filter) {
        if (checkExists(subreddit, where, filter)) {
          var data = filteredLists[subreddit][where][filter];
          return [data.points, data.average];
        }
        return [0, 0];
      },
      getGildStats: function(subreddit, filter) {
        if (checkExists(subreddit, 'gilds', filter)) {
          var data = filteredLists[subreddit]['gilds'][filter];
          return data.stats;
        }
      }
    };
    return factory;

    function checkExists(sub, where, filter, sort) {
      if  (!(sub in filteredLists)) {
        return false;
      }

      if (!(where in filteredLists[sub])) {
        return false;
      }

      if (!(filter in filteredLists[sub][where])) {
        return false;
      }

      if (sort && !(sort in filteredLists[sub][where][filter])) {
        return false;
      }

      return true;
    }

    function addFiltered(filter, sub, sort, where, data) {
      if (numListsCached >= 50) {
        clear(filteredLists);
        numListsCached = 0;
      }

      if (!(sub in filteredLists)) {
        filteredLists[sub] = {};
      }

      if (!(where in filteredLists[sub])) {
        filteredLists[sub][where] = {};
      }

      if (!(filter in filteredLists[sub][where])) {
        filteredLists[sub][where][filter] = {};
      }

      if (!(sort in filteredLists[sub][where][filter])) {
        filteredLists[sub][where][filter][sort] = data;
      }

      if (where === 'gilds') {
        calculateGilded(data, sub, where, filter);
      }

      if (where !== 'gilds' && filter !== 'all') {
        calculatePoints(sub, where, filter, data);
      }
      numListsCached += 1;
    }

    function calculateGilded(data, sub, where, filter) {
      var commentPoints = 0;
      var submitPoints = 0;
      var numComments = 0;
      var numSubmits = 0;

      for (var i = 0; i < data.length; i++) {
        var node = data[i];
        if (node.type === 'comment') {
          commentPoints += node.ups;
          numComments += 1;
        } else {
          submitPoints += node.ups;
          numSubmits += 1;
        }
      }

      var stats = {
        'commentPoints': commentPoints,
        'submitPoints': submitPoints,
        'numComments': numComments,
        'numSubmits': numSubmits,
        'commentAvg': $filter('average')(commentPoints, numComments, 0),
        'submitAvg': $filter('average')(submitPoints, numSubmits, 0)
      }

      filteredLists[sub][where][filter]['stats'] = stats;
    }

    function calculatePoints(sub, where, filter, data) {
      var points = 0;
      var total = data.length;

      for (var i = 0; i < total; i++) {
        try {
          var node = data[i];
          points += node.ups;
        } catch(e) {
        }
      }

      filteredLists[sub][where][filter]['points'] = points;

      var average = $filter('average')(points, total, 0);
      filteredLists[sub][where][filter]['average'] = average;
    }

    function filterData(data, where, filter) {
      if (filter === 'all') {
        return data;
      }

      var dataList = [];
      var limit = limits[filter];
      for (var i = 0; i < data.length; i++) {
        var node = data[i];
        var time = moment(node.created_utc*1000);

        if (time < limit) {
          break;
        }

        dataList.push(node);
      }

      return dataList;
    }

    /*
     Clears data
    */
    function clear(dataList) {
      for (var key in dataList) {
        if (dataList.hasOwnProperty(key)) {
          delete dataList[key];
        }
      }
    }

  }]);
