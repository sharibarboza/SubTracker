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
     Get the moment date object from a comment or submission
    */
    return function (post) {
      return moment(post.created_utc*1000);
    };
  }]);
