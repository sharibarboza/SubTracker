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
   	$scope.leastUpvoted = rank.getTopSub(keys, 'mostDown', subs);
   	$scope.newestSub = subFactory.getNewestSub();

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
