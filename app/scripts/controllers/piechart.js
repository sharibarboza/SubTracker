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

  $scope.color = ["#FC7753", "#66D7D1", "403D58", "#DBD56E", "#61C9A8", "#FF174D"];

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
