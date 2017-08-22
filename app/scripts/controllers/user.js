'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the tractApp
 */
 angular.module('tractApp')
 .controller('UserCtrl', ['$scope', '$routeParams', '$filter', '$window', 'userFactory', 'subFactory', 'moment', 'user', 'subs',
  function ($scope, $routeParams, $filter, $window, userFactory, subFactory, moment, user, subs) {

  $scope.main = false;

  $scope.setSortOption = function() {
    sessionStorage.sort = JSON.stringify($scope.subData.selectedSort);
  };

  $scope.getArray = function() {
    return $filter('sortSubs')($scope.subsArray, $scope.subData.selectedSort.value, $scope.subs);
  };

  var configUserData = function(response, store) {
    $scope.user = response.data.data;
    $scope.commentKarma = $scope.user.comment_karma;
    $scope.submitKarma = $scope.user.link_karma;
    $scope.totalKarma = $scope.commentKarma + $scope.submitKarma;
    $scope.username = $scope.user.name;
    $scope.created = moment($scope.user.created_utc*1000).local().format('MMMM Do YYYY');
    $scope.notfound = false;

    if (store) {
      sessionStorage.user = $scope.username;
      sessionStorage.userData = JSON.stringify(response);
    }
  };

  var configSubData = function(response, store) {
    $scope.comments = response.comments;
    $scope.submissions = response.submissions;
    $scope.subs = response.subs;
    $scope.dataAvailable = response.firstDate;
    $scope.latest = response.latest;

    $scope.subsArray = $filter('sortSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
    $scope.subLength = $scope.subsArray.length;
    $scope.totalItems = $scope.subLength;

    if (store) {
      sessionStorage.subData = JSON.stringify(response);
    }
  };

  var equalUser = function(session, param) {
    return session.toLowerCase() === param.toLowerCase();
  };

  var defaultSort = {value: 'subName', name: 'Subreddit name'};
  var sort;
  var processUser = true;

  if (user && subs) {
    configUserData(user, true);
    configSubData(subs, true);
  } else {
    user = JSON.parse(sessionStorage.userData);
    subs = JSON.parse(sessionStorage.subData);
    configUserData(user, false);
    configSubData(subs, false);
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
    selectedSort: {value: 'subName', name: 'Subreddit name'}
  };

}]);