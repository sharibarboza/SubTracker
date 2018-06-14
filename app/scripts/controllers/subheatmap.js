'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubHeatmapCtrl
 * @description
 * # SubHeatmapCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SubHeatmapCtrl', ['$scope', '$routeParams', 'subHeatmap', 'subFactory', function ($scope, $routeParams, subHeatmap, subFactory) {
    $scope.subreddit = $routeParams.subreddit;
    var subs = subFactory.getSubData().subs;

    $scope.mapData = subHeatmap.getSubMap($scope.username, $scope.subreddit, subs[$scope.subreddit], null);
    $scope.count = subHeatmap.getCount();
  }]);