'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # UserStatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserStatsCtrl', ['$scope', 'badges', 'subFactory', function ($scope, badges, subFactory) {
      // Get the subreddits for Most Active, Most Upvoted, Least Upvoted, & Newest
      $scope.subs = subFactory.getSubData().subs;
      $scope.sideBadges = badges.getAllSubs($scope.username);
  }]);
