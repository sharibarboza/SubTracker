'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubHeatmapCtrl
 * @description
 * # SubHeatmapCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SubHeatmapCtrl', ['$scope', '$routeParams', 'heatmap', 'subFactory', function ($scope, $routeParams, heatmap, subFactory) {
    $scope.subreddit = $routeParams.subreddit;
    var subs = subFactory.getSubData().subs;

    $scope.mapData = heatmap.getSubMap(subs[$scope.subreddit], null);
    $scope.count = heatmap.getCount();
  }]);
