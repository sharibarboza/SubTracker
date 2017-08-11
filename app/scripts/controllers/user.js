'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', '$filter', '$window', 'userFactory', 'subFactory', 'moment', 'amMoment', 
  function ($scope, $routeParams, $filter, $window, userFactory, subFactory, moment, amMoment) {

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

  $scope.main = false;
  $scope.processing = true; // Shows the loading progression
  $scope.ready = false; // Shows the data when it's done processing

  var username = $routeParams.username;
  var processUser = true;

  // Get the user's username and account creation date

  var configUserData = function(response) {
    $scope.user = response.data.data;
    $scope.commentKarma = $scope.user.comment_karma;
    $scope.submitKarma = $scope.user.link_karma;
    $scope.username = $scope.user.name;
    $scope.created = moment($scope.user.created_utc*1000).local().format('MMMM Do YYYY, h:mm a');
    $scope.notfound = false;
  };

  var configSubData = function(response) {
    if (response) {
      $scope.comments = response.comments;
      $scope.submissions = response.submissions;
      $scope.subs = response.subs;
    } else {
      $scope.comments = subFactory.getCommentList().length;
      $scope.submissions = subFactory.getSubmitList().length;
      $scope.subs = subFactory.getSubs();
    }

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
  };

  if ('user' in sessionStorage && sessionStorage.user === username) {
    configUserData(JSON.parse(sessionStorage.userData));
    configSubData(JSON.parse(sessionStorage.subData));

    processUser = false;
  }

  if (processUser) {
    userFactory.setUser(username);
    userFactory.getUser().then(function(response) {
      configUserData(response);
      sessionStorage.user = username;
      sessionStorage.userData = JSON.stringify(response);

      subFactory.setData($routeParams.username);
      subFactory.getData().then(function() {
        configSubData(null);
      });
    }, function() {
      $scope.user = false;
      $scope.notfound = true;
    });
  }

}]);