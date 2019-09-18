'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:WordcloudCtrl
 * @description
 * # WordcloudCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('WordcloudCtrl', ['$scope', 'words', '$routeParams', 'subFactory', function ($scope, words, $routeParams, subFactory) {
    $scope.subreddit = $routeParams.subreddit;
    $scope.chartReady = false;

    // Get the most mentioned words from a user's posts in a subreddit
    var subs = subFactory.getSubData().subs;
    $scope.colors = ['#f96854', '#97BBCD', '#3BC6D2', '#E975BF', '#C275E6', '#CDCB6A', '#3BA7A4', '#1DA1F2', '#E8E8E8', '#9099A1'];

    $scope.getChart = function() {
      $scope.words = words.getWords($scope.subreddit, $routeParams.username, subs);
      $scope.chartReady = true;     
    }

  }]);
