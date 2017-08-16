'use strict';

/**
 * @ngdoc service
 * @name tractApp.rank
 * @description
 * # rank
 * Factory in the tractApp.
 */
angular.module('tractApp')
  .factory('rank', ['$filter' ,function ($filter) {
    // Service logic
    // ...
    var subData;
    var subArray;

    // Public API here
    return {
      setData: function(data) {
        subData = data;
        subArray = Object.keys(subData);
      },
      getSubLength: function() {
        return subArray.length;
      },
      getSubRank: function (subreddit, attribute) {
        var sortedData = $filter('sortSubs')(subArray, attribute, subData);
        return sortedData.indexOf(subreddit) + 1;
      },
      getTopPost: function(data, attribute) {
        return $filter('sortPosts')(data, attribute)[0];
      }
    };
  }]);
