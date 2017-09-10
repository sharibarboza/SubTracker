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

    var factory = {
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
    return factory;
  });
