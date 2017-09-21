'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subInfo
 * @description
 * # subInfo
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('subInfo', function () {

    // Public API here
    return {
      getSubInfo: function(sub) {
        var url = "https://www.reddit.com/api/r/" + sub + '.json';
      }
    };
  });
