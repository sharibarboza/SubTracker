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

    var limitList = {};
    for (var i = 0; i < limitOptions.length; i++) {
      var val = limitOptions[i].value;
      limitList[val] = i;
    }

    var defaultLimit = 0;
    var currentLimit = limitOptions[defaultLimit];

    /*
     Sets the limited entries set by the user when searching for a redditor
    */

    var factory = {
      setLimit: function(limit) {
        currentLimit = limit;

        // Set limit in local storage
        localStorage.setItem('limit', limit.value);
      },
      getLimit: function() {
        var storedLimit = localStorage.getItem('limit');
        if (!storedLimit) {
          localStorage.setItem('limit', currentLimit.value);
        } else {
          var storedVal = limitList[storedLimit];
          currentLimit = limitOptions[storedVal];
        }
        return currentLimit;
      },
      getOptions: function() {
        return limitOptions;
      }
    };
    return factory;

  }]);
