'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the tractApp
 */
angular.module('tractApp')
  .controller('UserSubCtrl', ['$scope', '$routeParams', '$window', '$filter', 'rank', 
    function ($scope, $routeParams, $window, $filter, rank) {

    $window.scrollTo(0, 0);
    var defaultView = "25";

    $scope.subreddit = $routeParams.subreddit;
    $scope.username = $routeParams.username;

    var data = JSON.parse(sessionStorage.subData);
    $scope.sub = data.subs[$scope.subreddit];

    $scope.data = {
      sortOptions: [
        {value: 'newest', name: 'Newest'},
        {value: 'oldest', name: 'Oldest'},
        {value: 'mostUps', name: 'Most upvoted'},
        {value: 'mostDowns', name: 'Most controversial'},
      ],
      selectedSort: {value: 'newest', name: 'Newest'}
    };

    if ($scope.sub.comments.length > 0) {
      $scope.tab = 0;
    } else {
      $scope.tab = 1;
    }
    $scope.tabOptions = ['comments', 'submissions'];
    
    $scope.subPage = {};
    $scope.subPage.viewby = defaultView;
    $scope.subPage.items = parseInt(defaultView);
    $scope.subPage.max = 5;
    $scope.subPage.current = 1;

    rank.setData(JSON.parse(sessionStorage.subData).subs);
    $scope.subLength = rank.getSubLength();
    $scope.mostActiveRank = rank.getSubRank($scope.subreddit, 'mostActive');
    $scope.mostUpsRank = rank.getSubRank($scope.subreddit, 'totalUps');

    if ($scope.sub.comments.length > 0) {
      $scope.topPost = rank.getTopPost($scope.sub.comments, 'mostUps');
    }

    if ($scope.sub.submissions.length > 0) {
      $scope.topSubmit = rank.getTopPost($scope.sub.submissions, 'mostUps');
    }

    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
      $scope.subPage.current = 1;
    };

    $scope.isSet = function(num) {
      return $scope.tab === parseInt(num);
    };

    $scope.setItemsPerPage = function(num) {
      $scope.subPage.current = 1;
      $scope.subPage.items = num;
    };

    $scope.pageChange = function() {
      $window.scrollTo(0, 0);
    };

    $scope.setSortOption = function() {
      $scope.subPage.current = 1;
    };

    $scope.getArray = function() {
      var dataArray = $scope.sub[$scope.tabOptions[$scope.tab]];
      return $filter('sortPosts')(dataArray, $scope.data.selectedSort.value);
    };

    $scope.getActive = function(num) {
      if ($scope.isSet(num)) {
        return { 'active': true };
      }
    };

  }]);
