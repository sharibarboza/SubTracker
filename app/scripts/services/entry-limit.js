'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.entryLimit
 * @description
 * # entryLimit
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('entryLimit', ['moment', '$filter', function (moment, $filter) {
    var limitOptions = [
      { 'name': '1,000', 'value': 1000 },
      { 'name': '5,000', 'value': 5000 },
      { 'name': '10,000', 'value': 10000 },
      { 'name': 'All', 'value': 'All' },
    ]

    var currentLimit = limitOptions[0];

    /*
     Sets the limited entries set by the user when searching for a redditor
    */

    var factory = {
      setLimit: function(limit) {
        currentLimit = limit;
      },
      getLimit: function() {
        return currentLimit;
      },
      getOptions: function() {
        return limitOptions;
      }
    };
    return factory;

  }]);
