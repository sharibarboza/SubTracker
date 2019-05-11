'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SidebarCtrl
 * @description
 * # SidebarCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SidebarCtrl', ['$scope', '$timeout', '$mdSidenav', '$log', function ($scope, $timeout, $mdSidenav, $log) {

    $scope.toggleRight = function () {
      buildToggler('right');
    };

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };

    function buildToggler(navID) {

      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID).toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }]);
