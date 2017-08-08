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
  $scope.processing = true; // Shows the loading progression
  $scope.ready = false; // Shows the data when it's done processing

  $scope.data = {
    availableOptions: [
      {value: 'subName', name: 'Subreddit name'},
      {value: 'totalComments', name: 'Total comments'},
      {value: 'totalSubmits', name: 'Total submissions'},
      {value: 'totalUps', name: 'Total upvotes'},
      {value: 'lastSeen', name: 'Most recent activity'},
      {value: 'mostActive', name: 'Most activity'},
      {value: 'avgComment', name: 'Average upvotes per comment'},
      {value: 'avgSubmit', name: 'Average upvotes per submission'},
      {value: 'mostDown', name: 'Most controversial'},
    ],
    selectedOption: {value: 'subName', name: 'Subreddit name'}
  };

  // Based on username, fetch the user's latest comments and submissions
  subFactory.setData();
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