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

    var status = popularSubs.getData();
    status.then(function(response) {
      if (response.status == -1) {
        $scope.fetchedSubs = 0;
      } else {
        $scope.fetchedSubs = 1;
      }
    });
    newSubs.getData();

    // Display popular and new subreddits for front page
    $scope.popularSubs = popularSubs.getSubs();
    $scope.newSubs = newSubs.getSubs();
}]);
