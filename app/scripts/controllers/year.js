'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:YearCtrl
 * @description
 * # YearCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('YearCtrl', ['$scope', 'moment', function ($scope, moment) {
 	  $scope.year = moment().year();
}]);
