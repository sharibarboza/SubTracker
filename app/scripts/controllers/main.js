'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('MainCtrl', ['$scope', 'popularSubs', 'newSubs', 'moment', function ($scope, popularSubs, newSubs, moment) {
 	$scope.year = moment().year();

    // Main will determine whether to display the search bar in the nav 
    // Should not be displayed on main page
    $scope.main = true;
    $scope.page = 'home';
    $scope.popularSubs = popularSubs;
    $scope.newSubs = newSubs;
}]);