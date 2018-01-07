'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserHeatmapCtrl
 * @description
 * # UserHeatmapCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserHeatmapCtrl', ['$scope', 'heatmap', 'subFactory', function ($scope, heatmap, subFactory) {
    var subs = subFactory.getSubData().subs;

    $scope.mapData = heatmap.getUserMap(subs, null);
    $scope.count = heatmap.getCount();
  }]);
