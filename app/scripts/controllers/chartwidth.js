'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:ChartWidthCtrl
 * @description
 * # ChartWidthCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('ChartWidthCtrl', ['$scope', '$window', function ($scope, $window) {
    $scope.chartWidth = 100;
    if ($window.innerWidth < 500) {
      $scope.chartWidth = 140;
    }
    if ($window.innerWidth < 330) {
      $scope.chartWidth = 200;
    }
}]);
