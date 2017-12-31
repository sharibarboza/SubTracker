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
    rank.setData(subs);
    $scope.subLength = Object.keys(subs).length;

    $scope.badges = {
      'mostActiveRank' : {
        'image' : 'glyphicon glyphicon-stats',
        'rank' : $scope.subLength,
        'name' : 'MOST ACTIVE'
      },
      'mostUpsRank' : {
        'image' : 'glyphicon glyphicon-arrow-up',
        'rank' : $scope.subLength,
        'name' : 'MOST UPVOTED'
      },
      'mostCommentsRank' : {
        'image' : 'glyphicon glyphicon-comment',
        'rank' : $scope.subLength,
        'name' : 'MOST COMMENTS'
      },
      'mostSubmitsRank' : {
        'image' : 'glyphicon glyphicon-list-alt',
        'rank' : $scope.subLength,
        'name' : 'MOST SUBMITS'
      }
    }

    /*
     Displays activity rank and upvotes rank of the specific subreddit relative to the user's
     other subreddits.
    */
    $scope.badges['mostActiveRank'].rank = rank.getSubRank($scope.subreddit, 'mostActive');
    $scope.badges['mostUpsRank'].rank = rank.getSubRank($scope.subreddit, 'totalUps');
    $scope.badges['mostCommentsRank'].rank = rank.getSubRank($scope.subreddit, 'totalComments');
    $scope.badges['mostSubmitsRank'].rank = rank.getSubRank($scope.subreddit, 'totalSubmits');
  }]);
