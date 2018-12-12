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
    var words = words.getWords($scope.subreddit, $routeParams.username);
    $scope.upWords = words['up'];
    $scope.downWords = words['down'];

    $scope.colors = ['#14C4A1', '#039be5', '#00c853', '#4db6ac', '#1e88e5', '#00acc1', '#3f51b5', '#5e35b1', '#512da8'];
    $scope.downColors = ['#fbc02d', '#ffa000', '#ff5722', '#ff6700', '#ff004d', '#ffa726', '#e50068', '#f69500', '#c62828'];
  }]);
