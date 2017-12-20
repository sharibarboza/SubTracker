'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # UserStatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserStatsCtrl', ['$scope', 'subFactory', 'rank', 'sortFactory', 'subInfo', function ($scope, subFactory, rank, sortFactory, subInfo) {
    var subs = subFactory.getSubData().subs;
    var keys = subFactory.getDefaultSortedArray();

    $scope.mostActive = rank.getTopSub(keys, 'mostActive', subs);
    subInfo.getData($scope.mostActive).then(function(response) {
      $scope.mostActiveInfo = response;
      subFactory.setSubInfo($scope.mostActive, response);
    });

    $scope.mostUpvoted = rank.getTopSub(keys, 'totalUps', subs);
    subInfo.getData($scope.mostUpvoted).then(function(response) {
      $scope.mostUpvotedInfo = response;
      subFactory.setSubInfo($scope.mostUpvoted, response);
    });

    $scope.leastUpvoted = rank.getBottomSub(keys, 'totalUps', subs);
    subInfo.getData($scope.leastUpvoted).then(function(response) {
      $scope.leastUpvotedInfo = response;
      subFactory.setSubInfo($scope.leastUpvoted, response);
    });

    $scope.newestSub = subFactory.getNewestSub();
    subInfo.getData($scope.newestSub).then(function(response) {
      $scope.newestSubInfo = response;
      subFactory.setSubInfo($scope.newestSub, response);
    });

    // Reset filters to current sort value
    rank.getTopSub(keys, sortFactory.getSubSort().value, subs);
  }]);
