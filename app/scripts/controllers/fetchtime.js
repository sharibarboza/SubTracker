'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:FetchTimeCtrl
 * @description
 * # FetchTimeCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('FetchTimeCtrl', ['$scope', 'subFactory', '$window', function ($scope, subFactory, $window) {
    $scope.fetchTime = subFactory.getFetchTime();

    $scope.refresh = function() {
    	$window.location.reload();
    }
}]);