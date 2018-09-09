'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:ProgressCtrl
 * @description
 * # ProgressCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('ProgressCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.mainCount = 0;
    $rootScope.mainMsg = 'Fetching from Reddit ...';

    $rootScope.$on('mainCount', function(event, data) {
       $rootScope.mainCount = (data[0] / data[1]) * 100;
    });

}]);