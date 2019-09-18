'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:EntryLimit
 * @description
 * # EntryLimit
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('EntryLimitCtrl', ['$scope', 'entryLimit', '$filter', function ($scope, entryLimit, $filter) {
   var limit = entryLimit.getLimit();
   $scope.limitName = limit.name;
   $scope.currentLimit = limit.value;
   $scope.limitOptions = entryLimit.getOptions();
   $scope.tooltipMsg;
   getMsg();

   $scope.setLimit = function(option) {
     $scope.limitName = option.name;
     $scope.currentLimit = option.value;
     entryLimit.setLimit(option);
     getMsg();
   }

   function getMsg() {
     var msg;
     if ($scope.currentLimit === 'All') {
       msg = 'This will fetch all comments and posts.';
     } else {
       msg = 'This will fetch the last ' + $filter('number')($scope.currentLimit) + ' comments & ' + $filter('number')($scope.currentLimit) + ' posts.';
     }
     $scope.tooltipMsg = msg;
   }
}]);
