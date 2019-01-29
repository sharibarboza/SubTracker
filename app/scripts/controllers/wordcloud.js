'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:WordcloudCtrl
 * @description
 * # WordcloudCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('WordcloudCtrl', ['$scope', 'words', '$routeParams', function ($scope, words, $routeParams) {
    $scope.subreddit = $routeParams.subreddit;

    // Get the most mentioned words from a user's posts in a subreddit
    $scope.words = words.getWords($scope.subreddit, $routeParams.username);

    $scope.colors = ['#ee8b78', '#bc5e52', '#ff7043', '#4DAAB6', '#766c91', '#523b58', '#3f51b5', '#5e35b1', '#65738e'];
  }]);
