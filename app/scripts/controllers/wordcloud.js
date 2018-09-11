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
    $scope.words = words.getWords($scope.subreddit, $routeParams.username);
    $scope.colors = ["#67cad6", "#2979ff", "#d4e157", "#ffca28", "#ef5350", "#673ab7", "#00bcd4", "#e91e63", "#00C497", "#3F51B5"];
  }]);