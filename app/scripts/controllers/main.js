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
    // Main will determine whether to display the search bar in the nav 
    // Should not be displayed on main page
    $scope.main = true;
}]);