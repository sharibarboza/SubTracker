 'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:rank
 * @function
 * @description
 * # rank
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('rank', ['$filter', function ($filter) {

      var getTopPost = function(data, attribute) {
        // Returns the first element in the sorted array
        return $filter('sortPosts')(data, attribute)[0];
      };

      var getTopSub = function(keys, attribute, data) {
        // Returns the first subreddit in the sorted array
        return $filter('sortSubs')(keys, attribute, data)[0];
      };

      var getBottomSub = function(keys, attribute, data) {
        // Returns the last subreddit in the sorted array
        return $filter('sortSubs')(keys, attribute, data)[keys.length-1];
      };

      return function (type, attribute, data, keys) {
        if (type === 'topPost') {
          return getTopPost(data, attribute);
        } else if (type === 'topSub') {
          return getTopSub(keys, attribute, data);
        } else if (type === 'bottomSub') {
          return getBottomSub(keys, attribute, data);
        }
      };
  }]);
