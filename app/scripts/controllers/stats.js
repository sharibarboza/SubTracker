'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('StatsCtrl', ['$scope', 'subFactory', '$filter', 'rank', function ($scope, subFactory, $filter, rank) {
    var subs = subFactory.getSubData().subs;
    var keys = subFactory.getDefaultSortedArray();

    $scope.mostActive = rank.getTopSub(keys, 'mostActive', subs);
   	$scope.mostUpvoted = rank.getTopSub(keys, 'totalUps', subs);

   	$scope.firstSub = subFactory.getFirstPost().subreddit;
   	$scope.newestSub = subFactory.getNewestSub();
  }]);
