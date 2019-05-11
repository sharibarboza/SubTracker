'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # UserStatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserStatsCtrl', ['$scope', 'badges', function ($scope, badges) {
      // Get the subreddits for Most Active, Most Upvoted, Least Upvoted, & Newest
      $scope.badges = badges.getSubs($scope.username);

      // Get the subreddits for Best Comment, Best Post, Best Average, Newest, & Last Seen
      $scope.tableBadges = badges.getTableBadges($scope.username);
  }]);
