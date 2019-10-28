'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.filterPosts
 * @description
 * # filterPosts
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('filterPosts', ['moment', '$filter', function (moment, $filter) {

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
      getData: function(data, filter, subreddit, sort, where, limit) {
        var dataList;
        if (checkExists(subreddit, where, filter)) {
          if (checkExists(subreddit, where, filter, sort)) {
            var entries = filteredLists[subreddit][where][filter][sort];
            return entries.slice(0, limit);
          }
          var filteredObj = filteredLists[subreddit][where][filter];
          var firstKey = Object.keys(filteredObj)[0];
          dataList = filteredObj[firstKey];
        } else {
          dataList = filterData(data, filter);
        }

        var sortedList = $filter('sortPosts')(dataList, sort, subreddit, where);
        addFiltered(filter, subreddit, sort, where, sortedList);
        
        return sortedList.slice(0, limit);

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

      numListsCached += 1;
    }

    function filterData(data, filter) {
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
