'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:BadgesCtrl
 * @description
 * # BadgesCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('BadgesCtrl', ['$scope', 'badges', function ($scope, badges) {
   var badges = badges.getBadges($scope.username);
   $scope.badgeFlairs = [];

   for (var key in badges) {
     if (badges[key].sub === $scope.subreddit) {
       $scope.badgeFlairs.push(badges[key].name);
     }
   }
}]);
