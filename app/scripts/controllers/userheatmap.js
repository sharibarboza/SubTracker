'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserHeatmapCtrl
 * @description
 * # UserHeatmapCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserHeatmapCtrl', ['$scope', 'userHeatmap', 'subFactory', function ($scope, userHeatmap, subFactory) {
	$scope.currentUser = $scope.username;
	var subs = subFactory.getSubData().subs;

	 // Get data for activity heatmap for a user's general actiivty among all subreddits
	$scope.mapData = userHeatmap.getUserMap($scope.username, subs, null);
	$scope.count = userHeatmap.getCount();
  $scope.subAverage = userHeatmap.getAverage();
  }]);
