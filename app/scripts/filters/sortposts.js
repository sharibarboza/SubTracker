'use strict';

/**
 * @ngdoc filter
 * @name tractApp.filter:sortPosts
 * @function
 * @description
 * # sortPosts
 * Filter in the tractApp.
 */
angular.module('tractApp')
  .filter('sortPosts', ['moment', 'sortNum', function (moment, sortNum) {

    var sortDate = function(keys, reverse) {
      keys.sort(function(a, b) {
      	var num1, num2;
      	num1 = moment(a.created_utc*1000);
      	num2 = moment(b.created_utc*1000);

        return sortNum.get(num1, num2, a, b, reverse, null);
      });
      return keys;
    };

    var sortPoints = function(keys, reverse) {
    	keys.sort(function(a, b) {
    		return sortNum.get(a.ups, b.ups, a, b, reverse, 'date');
    	});
    	return keys;
    };

    return function (input, attribute) {
    	var sortedData = [];

    	if (input) {
    		if (attribute === 'newest') {
    			sortedData = sortDate(input, true);
    		} else if (attribute === 'oldest') {
    			sortedData = sortDate(input, false);
    		} else if (attribute === 'mostUps') {
    			sortedData = sortPoints(input, true);
    		} else if (attribute === 'mostDowns') {
    			sortedData = sortPoints(input, false);
    		}
    	}

      return sortedData;
    };
  }]);
