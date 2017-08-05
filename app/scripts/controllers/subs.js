'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:SubsCtrl
 * @description
 * # SubsCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('SubsCtrl', ['$scope', 'userFactory', 'subFactory' ,function ($scope, userFactory, subFactory) {
  $scope.processing = true;
  $scope.ready = false;

  var userPromise = userFactory.getUser();
  userPromise
  .then(function(response) {
    subFactory.setUser(response.data.data.name);
    return subFactory.setCommentList();
  }, function(error) {
    console.log('Error fetching comments: ' + error);
  })
  .then(function() {
    $scope.comments = subFactory.getCommentList();
    return subFactory.setSubmitList();
  }, function(error) {
    console.log('Error fetching submissions: ' + error);
  })
  .then(function() {
    $scope.submissions = subFactory.getSubmitList();
    subFactory.organizeComments($scope.comments);
    subFactory.organizeSubmitted($scope.submissions);

    $scope.subs = subFactory.getSubs();
    $scope.subsArray = Object.keys($scope.subs);
    $scope.processing = false;
    $scope.ready = true;

  });

}]);
