'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.months
 * @description
 * # months
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('months', function () {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var labels = [];

    var today = new Date();
    var d;
    var month;
    var numMonths = 11;

    for(var i = numMonths; i >= 0; i -= 1) {
      d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      month = monthNames[d.getMonth()];
      labels.push(month);
    }

    /*
     Matches term with the searchlist and returns the filtered array
    */
    var service = {
      getLabels: function() {
        return labels;
      }
    };
    return service;
  });
