'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the tractApp
 */
angular.module('tractApp')
  .controller('UsersubCtrl', ['$scope', '$routeParams' ,function ($scope, $routeParams) {
    $scope.subreddit = $routeParams.subreddit;
  }]);
