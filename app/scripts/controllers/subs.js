'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:SubsCtrl
 * @description
 * # SubsCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('SubsCtrl', ['$scope', 'userService', 'subService' ,function ($scope, userService, subService) {
  $scope.processing = true;
  $scope.ready = false;

  var userPromise = userService.getUser();
  userPromise
  .then(function(response) {
    subService.setUser(response.data.data.name);
    return subService.setCommentList();
  }, function(error) {
    console.log('Error fetching comments: ' + error);
  })
  .then(function() {
    $scope.comments = subService.getCommentList();
    return subService.setSubmitList();
  }, function(error) {
    console.log('Error fetching submissions: ' + error);
  })
  .then(function() {
    $scope.submissions = subService.getSubmitList();
    subService.organizeComments($scope.comments);
    subService.organizeSubmitted($scope.submissions);

    $scope.subs = subService.getSubs();
    $scope.subsArray = Object.keys($scope.subs);
    $scope.processing = false;
    $scope.ready = true;

  });

}]);
