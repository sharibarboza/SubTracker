'use strict';

/**
 * @ngdoc service
 * @name tractApp.sortHelper
 * @description
 * # sortHelper
 * Service in the tractApp.
 */
angular.module('tractApp')
  .service('sortNum', ['sortAlpha', 'moment', function (sortAlpha, moment) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var sort = function(num1, num2, a, b, reverse, secondary) {
      var val1, val2;

      if (reverse) {
        val1 = 1;
        val2 = -1;
      } else {
        val1 = -1;
        val2 = 1;
      }

      if (num1 < num2) { return val1; } 
      else if (num1 > num2) { return val2; } 
      else { 
      	if (secondary === 'alpha') { return sortAlpha.get(a, b); }
      	else if (secondary === 'date') { 
      		num1 = moment(a.created_utc*1000);
      		num2 = moment(b.created_utc*1000);
      		return sort(num1, num2, a, b, true, null); 
      	} 
      }
    };

    return {
	    get: function(num1, num2, a, b, reverse, secondary) {
	    	return sort(num1, num2, a, b, reverse, secondary);
	    }
    };

  }]);
