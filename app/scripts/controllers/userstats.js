'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:StatsCtrl
 * @description
 * # UserStatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserStatsCtrl', ['$scope', 'badges', 'subFactory', 'subInfo', 'recentTimes', function ($scope, badges, subFactory, subInfo, recentTimes) {
      // Get the subreddits for Most Active, Most Upvoted, Least Upvoted, & Newest
      $scope.sideBadges = badges.getSubs($scope.username);
      var subs = subFactory.getAllSubs();
      $scope.icons = {};

      for (var key in $scope.sideBadges) {
        if (!subs[key].icon || subs[key].info == null) {
          subInfo.getData(key).then(function(response) {
            var sub = response.display_name;
            subFactory.setIcons(sub, response.icon_img);
            subFactory.setSubInfo(sub, response);
            $scope.icons[sub] = response.icon_img;
          });
        } else {
          $scope.icons[key] = subs[key].icon;
        }
      }

      var latestSub = badges.getBadges()['lastSeen'].sub;
      var latestPost = recentTimes.getData($scope.username, latestSub, subs[latestSub]);
      $scope.recentlyActive = recentTimes.recentlyActive(latestSub, 12);
  }]);
