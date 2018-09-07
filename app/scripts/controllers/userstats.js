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
    $scope.badges = badges.getSubs($scope.username);
    $scope.tableBadges = badges.getTableBadges();
  }]);
