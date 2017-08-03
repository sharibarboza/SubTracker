'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tractApp
 */
angular.module('tractApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
  	$scope.main = true;
    $scope.processing = false;
  }]);
