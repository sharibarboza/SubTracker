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
      
    var defaultSubSort = {value: 'subName', name: 'Subreddit name'};
    var subSort = defaultSubSort;

    return {
      getDefaultSubSort: function() {
        return defaultSubSort;
      },
      setSubSort: function(sortObj) {
        subSort = sortObj;
      },
      getSubSort: function() {
        return subSort;
      }
    };
  });
