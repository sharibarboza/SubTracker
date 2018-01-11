'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.sortFactory
 * @description
 * # sortFactory
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('sortFactory', function () {
      
    var defaultSubSort = {value: 'lastSeen', name: 'Most recent activity'};
    var subSort = defaultSubSort;

    var sortSubs = {
      sortOptions: [
        {value: 'subName', name: 'Subreddit name'},
        {value: 'totalComments', name: 'Total comments'},
        {value: 'totalSubmits', name: 'Total submissions'},
        {value: 'totalUps', name: 'Total upvotes'},
        {value: 'lastSeen', name: 'Most recent activity'},
        {value: 'mostActive', name: 'Most activity'},
        {value: 'avgComment', name: 'Average upvotes per comment'},
        {value: 'avgSubmit', name: 'Average upvotes per submission'},
        {value: 'avgPost', name: 'Average upvotes per post'},
        {value: 'mostDown', name: 'Most controversial'},
      ]
    };

    var sortPosts = {
      sortOptions: [
        {value: 'newest', name: 'Newest'},
        {value: 'oldest', name: 'Oldest'},
        {value: 'mostUps', name: 'Most upvoted'},
        {value: 'mostDowns', name: 'Most controversial'},
      ]
    };

    var factory = {
      getDefaultSubSort: function() {
        return defaultSubSort;
      },
      setSubSort: function(sort) {
        subSort = sort;
      },
      getSubSort: function() {
        return subSort;
      },
      getSubSorting: function() {
        return sortSubs;
      },
      getPostSorting: function() {
        return sortPosts;
      }
    };
    return factory;
  });
