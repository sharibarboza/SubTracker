'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.filterPosts
 * @description
 * # filterPosts
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('filterPosts', ['moment', function (moment) {

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

    // Contains cached sorted lists of subreddits
    var filterLists = {};

    // The default value for sorting subreddits (totalUps - subreddits with the most points)
    var defaultFilter = filterPosts.sortOptions[0];

    // The current sorting value of the subreddits
    var currentFilter = defaultFilter;

    var factory = {
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
      clearFilters: function() {
        filterLists = {};
      },
      getData: function(filter, data) {
        if (filter === 'all') {
          return data;
        } else {
          return filterData(data, limits[filter]);
        }
      }
    };
    return factory;

    function filterData(data, limit) {
      var dataList = [];

      for (var i = 0; i < data.length; i++) {
        var node = data[i];
        var time = moment(node.created_utc*1000);

        if (time >= limit) {
          dataList.push(node);
        } else {
          break;
        }
      }
      return dataList;
    }

  }]);
