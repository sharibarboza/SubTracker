'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:PiechartCtrl
 * @description
 * # PiechartCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('PiechartCtrl', function ($scope) {

  $scope.color = ["80deea", "#fb8c00", "#d4e157", "#673ab7", "#ffca28", "#2979ff", "#f44336", "#9c27b0", "#aeea00", "#303f9f"];

  $scope.hoverIn = function(_index) {
    var sel = d3.selectAll('.arc').filter(function(d) {
      return d.data.id === _index;
    });
    this.mouseOverPath.call(sel.select('path')[0][0], sel.datum())
  };

  $scope.hoverOut = function(_index) {
    var sel = d3.selectAll('.arc').filter(function(d) {
      return d.data.id === _index;
    });
    this.mouseOutPath.call(sel.select('path')[0][0], sel.datum())
  };
  });
