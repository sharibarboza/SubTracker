'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:date
 * @function
 * @description
 * # date
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('date', ['moment', function (moment) {

    /*
     Truncate text posts to a certain number of words
    */
    return function (post) {
      return moment(post.created_utc*1000);
    };
  }]);
