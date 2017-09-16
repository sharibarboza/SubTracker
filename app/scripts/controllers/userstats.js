'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # UserStatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserStatsCtrl', ['$scope', 'subFactory', 'rank', function ($scope, subFactory, rank) {
    var subs = subFactory.getSubData().subs;
    var keys = subFactory.getDefaultSortedArray();

    $scope.mostActive = rank.getTopSub(keys, 'mostActive', subs);
    $scope.mostUpvoted = rank.getTopSub(keys, 'totalUps', subs);
    $scope.leastUpvoted = rank.getBottomSub(keys, 'totalUps', subs);
    $scope.newestSub = subFactory.getNewestSub();
  }]);
