'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:PreviousUsersCtrl
 * @description
 * # PreviousUsersCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('PreviousUsersCtrl', ['$scope', function ($scope) {
   /*
    Previously searched users
   */
   if ('previous' in localStorage) {
     var prevUsers = localStorage.getItem('previous').split(',').reverse();
     $scope.prevUsers = [];

     for (var i = 0; i < prevUsers.length; i++) {
       var name = prevUsers[i];
       if (name !== "" && name.toLowerCase() !== $scope.username.toLowerCase()) {
         $scope.prevUsers.push(name);
       }
     }
   } else {
     $scope.prevUsers = [];
   }

   if ('prevData' in localStorage) {
     $scope.prevData = JSON.parse(localStorage.getItem('prevData'));
   } else {
     $scope.prevData = {};
   }
}]);
