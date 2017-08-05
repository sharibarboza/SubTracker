'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', 'userService', function ($scope, $routeParams, userService) {
  $scope.main = false;

  userService.setUser($routeParams.username);
  var userPromise = userService.getUser();
  userPromise
  .then(function(response) {
    $scope.user = response.data.data;
    $scope.username = $scope.user.name;
    $scope.created = new Date($scope.user.created_utc*1000);
  });

}]);
