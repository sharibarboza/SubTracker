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

    $scope.badges = {
      'mostActive' : {
        'image' : null,
        'name' : 'MOST ACTIVE SUB',
        'points' : 0 
      },
      'mostUpvoted' : {
        'image' : null,
        'name' : 'MOST UPVOTED SUB',
        'points' : 0 
      },
      'leastUpvoted' : {
        'image' : null,
        'name' : 'LEAST UPVOTED SUB',
        'points' : 0 
      },
      'newestSub' : {
        'image' :null,
        'name' : 'NEWEST SUB',
        'points' : 0 
      }
    }

    var mostActiveSub = rank.getTopSub(keys, 'mostActive', subs);
    $scope.badges['mostActive'].sub = mostActiveSub;
    subInfo.getData(mostActiveSub).then(function(response) {
      $scope.mostActiveInfo = response;
      $scope.badges['mostActive'].image = response.icon_img;
      $scope.badges['mostActive'].points = subs[mostActiveSub].total_ups;
      subFactory.setSubInfo(mostActiveSub, response);
    });

    var mostUpvotedSub = rank.getTopSub(keys, 'totalUps', subs);
    $scope.badges['mostUpvoted'].sub = mostUpvotedSub;
    subInfo.getData(mostUpvotedSub).then(function(response) {
      $scope.mostUpvotedInfo = response;
      $scope.badges['mostUpvoted'].image = response.icon_img;
      $scope.badges['mostUpvoted'].points = subs[mostUpvotedSub].total_ups;
      subFactory.setSubInfo(mostUpvotedSub, response);
    });

    var leastUpvotedSub = rank.getBottomSub(keys, 'totalUps', subs);
    $scope.badges['leastUpvoted'].sub = leastUpvotedSub;
    subInfo.getData(leastUpvotedSub).then(function(response) {
      $scope.leastUpvotedInfo = response;
      $scope.badges['leastUpvoted'].image = response.icon_img;
      $scope.badges['leastUpvoted'].points = subs[leastUpvotedSub].total_ups;
      subFactory.setSubInfo(leastUpvotedSub, response);
    });

    var newestSub = subFactory.getNewestSub();
    $scope.badges['newestSub'].sub = newestSub;
    subInfo.getData(newestSub).then(function(response) {
      $scope.newestSubInfo = response;
      $scope.badges['newestSub'].image = response.icon_img;
      $scope.badges['newestSub'].points = subs[newestSub].total_ups;
      subFactory.setSubInfo(newestSub, response);
    });

    // Reset filters to current sort value
    rank.getTopSub(keys, sortFactory.getSubSort().value, subs);
  }]);
