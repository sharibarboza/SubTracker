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

  var defaultSort = {value: 'subName', name: 'Subreddit name'};
  var sort;
  var username = $routeParams.username;
  var processUser = true;

  $scope.main = false;
  $scope.processing = true; // Shows the loading progression
  $scope.ready = false; // Shows the data when it's done processing

  $scope.setSortOption = function() {
    sessionStorage.sort = JSON.stringify($scope.subData.selectedSort);
  };

  $scope.getArray = function() {
    return $filter('sortSubs')($scope.subsArray, $scope.subData.selectedSort.value, $scope.subs);
  };

  var configUserData = function(response) {
    $scope.user = response.data.data;
    $scope.commentKarma = $scope.user.comment_karma;
    $scope.submitKarma = $scope.user.link_karma;
    $scope.totalKarma = $scope.commentKarma + $scope.submitKarma;
    $scope.username = $scope.user.name;
    $scope.created = moment($scope.user.created_utc*1000).local().format('MMMM Do YYYY');
    $scope.notfound = false;
  };

  var configSubData = function(response) {
    $scope.comments = response.comments;
    $scope.submissions = response.submissions;
    $scope.subs = response.subs;
    $scope.dataAvailable = response.firstDate;
    $scope.latest = response.latest;

    $scope.subsArray = $filter('sortSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
    $scope.subLength = $scope.subsArray.length;
    $scope.totalItems = $scope.subLength;

    $scope.processing = false;
    $scope.ready = true;
  };

  var cachedData = function() {
    return 'user' in sessionStorage && sessionStorage.user === username;
  };

  if (cachedData()) {
    processUser = false;
    configUserData(JSON.parse(sessionStorage.userData));
    configSubData(JSON.parse(sessionStorage.subData));
    sort = JSON.parse(sessionStorage.sort);
  } else {
    sort = defaultSort;
  }

  if (processUser) {
    userFactory.setUser(username);

    userFactory.getUser().then(function(response) {
      configUserData(response);
      sessionStorage.user = username;
      sessionStorage.userData = JSON.stringify(response);

      subFactory.setData($routeParams.username);
      subFactory.getData().then(function() {
        configSubData(subFactory.getSubData());
      });

      sessionStorage.sort = JSON.stringify(defaultSort);
    }, function() {
      $scope.user = false;
      $scope.notfound = true;
    });
  }

  $scope.subData = {
    sortOptions: [
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
    selectedSort: sort
  };

}]);