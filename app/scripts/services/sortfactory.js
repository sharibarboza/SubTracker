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
        {value: 'totalUps', name: 'Total points'},
        {value: 'mostActive', name: 'Most activity'},
        {value: 'lastSeen', name: 'Most recent activity'},
        {value: 'mostGilded', name: 'Most gilded'},
        {value: 'totalComments', name: 'Total comments'},
        {value: 'totalSubmits', name: 'Total posts'},
        {value: 'subName', name: 'Subreddit name'},
        {value: 'mostDown', name: 'Most controversial'},
      ]
    };

    var sortPosts = {
      sortOptions: [
        {value: 'newest', name: 'Newest'},
        {value: 'oldest', name: 'Oldest'},
        {value: 'mostUps', name: 'Most Points'},
        {value: 'mostDowns', name: 'Least Points'},
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
        if (Object.keys(sortedSubLists).length == 20) {
          clear();
        }

        sortedSubLists[attribute] = list;
      },
      clearSorted: function() {
        clear();
      },
      getSorted: function(attribute) {
        return sortedSubLists[attribute];
      }
    };
    return factory;

    /*
     Clears data
    */
    function clear() {
      for (var key in sortedSubLists) {
        if (sortedSubLists.hasOwnProperty(key)) {
          delete sortedSubLists[key];
        }
      }
    }
  });
