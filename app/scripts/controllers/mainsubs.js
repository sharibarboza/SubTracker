'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:MainSubsCtrl
 * @description
 * # MainCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('MainSubsCtrl', ['$scope', '$rootScope', 'popularSubs', 'newSubs', 'moment', function ($scope, $rootScope, popularSubs, newSubs, moment) {
 	  $scope.year = moment().year();
    $rootScope.title = 'SubSnoop | Home';

    // Main will determine whether to display the search bar in the nav
    // Should not be displayed on main page
    $scope.main = true;
    $scope.page = 'home';

    popularSubs.getData();
    newSubs.getData();
    $scope.fetchedSubs = popularSubs.getStatus();

    // Display popular and new subreddits for front page
    $scope.popularSubs = popularSubs.getSubs();
    $scope.newSubs = newSubs.getSubs();
}]);
