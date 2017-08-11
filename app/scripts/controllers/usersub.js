'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the tractApp
 */
angular.module('tractApp')
  .controller('UsersubCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.subreddit = $routeParams.subreddit;
  	$scope.username = $routeParams.username;

  	var data = JSON.parse(sessionStorage.subData);
  	$scope.sub = data.subs[$scope.subreddit];
  	$scope.gilded = $scope.sub.gilded_comments + $scope.sub.gilded_submits;

  	if ($scope.sub.comments.length > 0) {
  		$scope.averageComment = ($scope.sub.comment_ups / $scope.sub.comments.length).toFixed(0);
  	} else {
  		$scope.averageComment = 0;
  	}

  	if ($scope.sub.submissions.length > 0) {
   		$scope.averageSubmit = ($scope.sub.submitted_ups / $scope.sub.submissions.length).toFixed(0);
  	} else {
  		$scope.averageSubmit = 0;
  	}
  }]);
