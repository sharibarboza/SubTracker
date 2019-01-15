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

    /*
     Contains all the categories to sort subreddits and to sort posts
     */

    var sortSubs = {
      sortOptions: [
        {value: 'totalUps', name: 'Total Cumulative Points'},
        {value: 'avgUps', name: 'Average Points Per Recent Months'},
        {value: 'mostActive', name: 'Most activity'},
        {value: 'lastSeen', name: 'Most recent activity'},
        {value: 'subName', name: 'Subreddit name'},
        {value: 'totalComments', name: 'Total comments'},
        {value: 'totalSubmits', name: 'Total posts'},
        {value: 'mostGilded', name: 'Most gilded posts'},
        {value: 'avgComment', name: 'Average upvotes per comment'},
        {value: 'avgSubmit', name: 'Average upvotes per post'},
        {value: 'avgPost', name: 'Average upvotes per entry'},
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

    // Contains cached sorted lists of subreddits
    var sortedSubLists = {};

    // The default value for sorting subreddits (totalUps - subreddits with the most points)
    var defaultSubSort = sortSubs.sortOptions[0];

    // The current sorting value of the subreddits
    var subSort = defaultSubSort;

    // The default value for sorting posts (newest - most recent posts)
    var defaultPostSort = sortPosts.sortOptions[0];

    var factory = {
      getDefaultSubSort: function() {
        return defaultSubSort;
      },
      setSubSort: function(sort) {
        subSort = sort;
      },
      getDefaultPostSort: function() {
        return defaultPostSort;
      },
      getSubSort: function() {
        return subSort;
      },
      getSubSorting: function() {
        return sortSubs;
      },
      getPostSorting: function() {
        return sortPosts;
      },
      isSorted: function(attribute) {
          return (attribute in sortedSubLists);
      },
      addSorted: function(attribute, list) {
        sortedSubLists[attribute] = list;
      },
      clearSorted: function() {
        sortedSubLists = {};
      },
      getSorted: function(attribute) {
        return sortedSubLists[attribute];
      }
    };
    return factory;
  });
