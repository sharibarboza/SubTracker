'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', 'userService', 'subService', function ($scope, $routeParams, userService, subService) {
  $scope.main = false;
  $scope.processing = true;
  $scope.ready = false;

  var userPromise = userService.getAbout($routeParams.username);
  userPromise
  .then(function(response) {
    $scope.user = response.data.data;
    $scope.username = $scope.user.name;
    $scope.created = new Date($scope.user.created_utc*1000);
    return $scope.username;
  })
  .then(function(username) {
    $scope.comments = [];

      // Get all user's last 1000 comments & submissions
      var commentPromise = userService.getComments(username, 'first');
      var comments = commentPromise
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return response; });
      return comments;
    }, function(error) {
      console.log('Error fetching comments: ' + error);
    })
  .then(function() {
    subService.organizeComments($scope.comments);
    $scope.submissions = [];

    var submitPromise = userService.getSubmitted($scope.username, 'first');
    var submits = submitPromise
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return getData(response, 'submissions'); })
    .then(function(response) { return response; });
    return submits;
  }, function(error) {
    console.log('Error fetching submissions: ' + error);
  })
  .then(function() {
    subService.organizeSubmitted($scope.submissions);
    $scope.subs = subService.getSubs();
    $scope.subsArray = Object.keys($scope.subs);
    $scope.processing = false;
    $scope.ready = true;
  }, function(error) { 
    console.log('Error: ' + error);
  });

  // Get the data and set up for the next promise
  var getData = function(response, where) {
    if (response) {
      var after = response.data.data.after;
      var data = response.data.data.children;

      for (var i = 0; i < data.length; i++) {
        if (where === 'comments') {
          $scope.comments.push(data[i]);
        } else {
          $scope.submissions.push(data[i]);
        }
      }

      if (after) {
        if (where === 'comments') {
          return userService.getComments($scope.username, after);
        } else {
          return userService.getSubmitted($scope.username, after);
        }

      }
    }
    return null;
  };


}]);
