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
    $scope.colors = ["#2979ff", "#d4e157", "#ffca28", "#673ab7", "#00C497", "#67cad6", "#ef5350"];
  }]);