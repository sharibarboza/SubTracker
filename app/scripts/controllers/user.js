'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', 'userFactory', function ($scope, $routeParams, userFactory) {
  $scope.main = false;

  userFactory.setUser($routeParams.username);
  var userPromise = userFactory.getUser();
  userPromise
  .then(function(response) {
    $scope.user = response.data.data;
    $scope.username = $scope.user.name;
    $scope.created = new Date($scope.user.created_utc*1000);
    $scope.notfound = false;
  }, function() {
  	$scope.user = false;
  	$scope.notfound = true;
  });

}]);
