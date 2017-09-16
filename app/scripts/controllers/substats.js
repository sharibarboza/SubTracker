'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubstatsCtrl
 * @description
 * # SubstatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SubStatsCtrl', ['$scope', 'subFactory', 'rank', '$filter', function ($scope, subFactory, rank, $filter) {
    var subs = subFactory.getSubData().subs;

    /*
     Displays activity rank and upvotes rank of the specific subreddit relative to the user's
     other subreddits. This is what's displayed in the first sidebar card under the link to the
     subreddit's page.
    */
    rank.setData(subs);
    $scope.subLength = Object.keys(subs).length;
    $scope.mostActiveRank = rank.getSubRank($scope.subreddit, 'mostActive');
    $scope.mostUpsRank = rank.getSubRank($scope.subreddit, 'totalUps');
    $scope.commentAvgRank = rank.getSubRank($scope.subreddit, 'avgComment');
    $scope.submitAvgRank = rank.getSubRank($scope.subreddit, 'avgSubmit');
    $scope.mostCommentsRank = rank.getSubRank($scope.subreddit, 'totalComments');
    $scope.mostSubmitsRank = rank.getSubRank($scope.subreddit, 'totalSubmits');
  }]);
