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
    var subs = subFactory.getSubData().subs;
    $scope.subreddit = $routeParams.subreddit;

    $scope.words = words.getWords(subs, $scope.subreddit);
    $scope.colors = ["#2979ff", "#d4e157", "#ffca28", "#673ab7", "#fb8c00", "#67cad6", "#e64560"];
  }]);