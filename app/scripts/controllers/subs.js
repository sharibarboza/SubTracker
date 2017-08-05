'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:SubsCtrl
 * @description
 * # SubsCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('SubsCtrl', ['$scope', 'subFactory' ,function ($scope, subFactory) {
  $scope.processing = true;
  $scope.ready = false;
  
  var promise = subFactory.getData();
  promise.then(function() {
    $scope.comments = subFactory.getCommentList();
    $scope.submissions = subFactory.getSubmitList();
    $scope.subs = subFactory.getSubs();
    $scope.subsArray = Object.keys($scope.subs);

    $scope.processing = false;
    $scope.ready = true;
  });

}]);
