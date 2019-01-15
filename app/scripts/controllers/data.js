'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:DataCtrl
 * @description
 * # DataCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('DataCtrl', ['$scope', '$location', function ($scope, $location) {
   /*
    Refresh sub data
   */
   $scope.refreshData = function() {
     delete localStorage.user;
     delete localStorage.data;
     location.reload();
   }

   /*
    Clear storage of previous users
   */
   $scope.clearStorage = function() {
     delete localStorage.previous;
     delete localStorage.prevData;
     $scope.refreshData();
   }
}]);
