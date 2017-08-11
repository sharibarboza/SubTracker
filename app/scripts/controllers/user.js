'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', '$filter', '$window', 'userFactory', 'subFactory', 'moment', 
  function ($scope, $routeParams, $filter, $window, userFactory, subFactory, moment) {

  $scope.setPage = function(pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    $window.scrollTo(0, 200);
  };

  $scope.setItemsPerPage = function(num) {
    $scope.itemsPerPage = num;
    sessionStorage.view = num;
    $scope.resetPage();
  };

  $scope.setOption = function() {
    sessionStorage.sort = JSON.stringify($scope.data.selectedOption);
    $scope.resetPage();
  };

  $scope.resetPage = function() {
    $scope.currentPage = 1;
  };

  $scope.getArray = function() {
    return $filter('orderSubs')($scope.subsArray, $scope.data.selectedOption.value, $scope.subs);
  };

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
      $scope.dataAvailable = response.firstDate;
    } else {
      $scope.comments = subFactory.getCommentList().length;
      $scope.submissions = subFactory.getSubmitList().length;
      $scope.subs = subFactory.getSubs();
      $scope.dataAvailable = subFactory.getDataAvailable();
    }

    $scope.subsArray = $filter('orderSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
    $scope.subLength = $scope.subsArray.length;
    $scope.totalItems = $scope.subLength;
    $scope.paginate = $scope.subLength > $scope.itemsPerPage;

    $scope.processing = false;
    $scope.ready = true;
  };

  var cachedData = function() {
    return 'user' in sessionStorage && sessionStorage.user === username;
  };


  var defaultSort = {value: 'subName', name: 'Subreddit name'};
  var defaultView = "25";
  var sort;
  var username = $routeParams.username;
  var processUser = true;

  $scope.main = false;
  $scope.processing = true; // Shows the loading progression
  $scope.ready = false; // Shows the data when it's done processing
  $scope.itemsPerPage = defaultView;
  $scope.maxSize = 10;
  $scope.currentPage = 1;

  // Get the user's username and account creation date
  if (cachedData()) {
    configUserData(JSON.parse(sessionStorage.userData));
    configSubData(JSON.parse(sessionStorage.subData));
    processUser = false;
  }

  if (cachedData()) {
    sort = JSON.parse(sessionStorage.sort);
  } else {
    sort = defaultSort;
  }
  if (cachedData()) {
    $scope.itemsPerPage = sessionStorage.view;

  } else {
    $scope.itemsPerPage = defaultView;
  }

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
    selectedOption: sort
  };

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

      sessionStorage.sort = JSON.stringify(defaultSort);
      sessionStorage.view = defaultView;
    }, function() {
      $scope.user = false;
      $scope.notfound = true;
    });
  }

}]);