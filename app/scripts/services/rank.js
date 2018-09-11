'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.rank
 * @description
 * # rank
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('rank', ['$filter', function ($filter) {
    /*
    Used primarily for calculating ranks of sorted subreddits or posts.
    Also used, so far, to return the top ranking element in a sorted posts array.
    */
    var factory = {
      getTopPost: function(data, attribute) {
        // Returns the first element in the sorted array
        return $filter('sortPosts')(data, attribute)[0];
      },
      getTopSub: function(keys, attribute, data) {
        // Returns the first subreddit in the sorted array
        return $filter('sortSubs')(keys, attribute, data)[0];
      },
      getBottomSub: function(keys, attribute, data) {
        // Returns the last subreddit in the sorted array
        return $filter('sortSubs')(keys, attribute, data)[keys.length-1];
      }
    };
    return factory;
  }]);
