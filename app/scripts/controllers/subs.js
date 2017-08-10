'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:SubsCtrl
 * @description
 * # SubsCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('SubsCtrl', ['$scope', 'amMoment', 'subFactory', '$filter', '$window', function ($scope, amMoment, subFactory, $filter, $window) {

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $window.scrollTo(0, 200);
  };

  $scope.setItemsPerPage = function(num) {
    $scope.itemsPerPage = num;
    $scope.resetPage();
  };

  $scope.resetPage = function() {
    $scope.currentPage = 1;
  };

  $scope.getArray = function() {
    return $filter('orderSubs')($scope.subsArray, $scope.data.selectedOption.value, $scope.subs);
  };

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
    $scope.subsArray = $filter('orderSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
    $scope.subLength = $scope.subsArray.length;

    $scope.viewby = "25";
    $scope.totalItems = $scope.subLength;
    $scope.currentPage = 1;
    $scope.itemsPerPage = parseInt($scope.viewby);
    $scope.maxSize = 10;
    $scope.paginate = $scope.subLength > $scope.itemsPerPage;

    $scope.processing = false;
    $scope.ready = true;
  });

}]);