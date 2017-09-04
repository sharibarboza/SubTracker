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

    var subData;
    var subArray; // Array containing the names of the subreddits

    /*
    Used primarily for calculating ranks of sorted subreddits or posts.
    Also used, so far, to return the top ranking element in a sorted posts array.
    */
    return {
      setData: function(data) {
        subData = data;
        subArray = Object.keys(subData);
      },
      getSubRank: function (subreddit, attribute) {
        // Gets the rank of the specific subreddit
        var sortedData = $filter('sortSubs')(subArray, attribute, subData);
        return sortedData.indexOf(subreddit) + 1;
      },
      getTopPost: function(data, attribute) {
        // Returns the first element in the sorted array
        return $filter('sortPosts')(data, attribute)[0];
      }
    };
  }]);
