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

    // Get the most mentioned words from a user's posts in a subreddit
    var subs = subFactory.getSubData().subs;
    $scope.words = words.getWords($scope.subreddit, $routeParams.username, subs);

    $scope.colors = ['#f96854', '#645F6B', '#174cba', '#cc5763', '#964276', '#21159e', '#0f80d4', '#578386', '#4a2590'];
  }]);
