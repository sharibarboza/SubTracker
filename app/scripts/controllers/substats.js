'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubstatsCtrl
 * @description
 * # SubstatsCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SubStatsCtrl', ['$scope', 'subFactory', 'rankings', function ($scope, subFactory, rankings) {
    $scope.subLength = subFactory.getSubLength();
    $scope.badges = rankings.getStats($scope.subreddit);
  }]);
