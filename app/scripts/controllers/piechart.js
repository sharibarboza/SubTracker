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

  $scope.chartLimit = 20;
  $scope.color = ["80deea", "#fb8c00", "#d4e157", "#673ab7", "#e64560", "#ffca28", "#2979ff"];

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
