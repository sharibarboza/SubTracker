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
     var count = 0;

     for (var i = 0; i < 6; i++) {
       var name = prevUsers[i];
       if (count >= 5) {
         break;
       }

       try {
         if (name !== "" && name.toLowerCase() !== $scope.username.toLowerCase()) {
           $scope.prevUsers.push(name);
           count += 1;
         }
       } catch(e) {

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
