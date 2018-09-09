'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:ProgressSubCtrl
 * @description
 * # ProgressSubCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('ProgressSubCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.subCount = 0;

    $rootScope.$on('subCount', function(event, data) {
        if (data !== undefined) {
          $rootScope.subCount = (data[0] / data[1]) * 100;
        } else {
          $rootScope.subCount = undefined;
        }
    });

}]);