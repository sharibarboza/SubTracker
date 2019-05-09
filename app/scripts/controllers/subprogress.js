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

    /*
     Watch for changes to the post count coming from the posts being fetched
     from the API requests
     */
    $rootScope.$on('subCount', function(event, data) {
        if (data !== undefined) {
          $rootScope.subCount = (data[0] / data[1]) * 100;
        } else {
          $rootScope.subCount = undefined;
        }
    });

}]);
