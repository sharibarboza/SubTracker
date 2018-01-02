'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:today
 * @function
 * @description
 * # today
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('today', ['moment', function (moment) {

    /*
     Check if a date equals today's date
    */
    return function (date) {
      var currentDate = moment().format('MM/DD/YYYY');
      var otherDate = moment(date).format('MM/DD/YYYY');
      
      return currentDate == otherDate;
    };
  }]);
