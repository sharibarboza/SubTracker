'use strict';

/**
 * @ngdoc function
 * @name tractApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the tractApp
 */
angular.module('tractApp')
  .controller('UsersubCtrl', ['$scope', '$routeParams', '$window', '$filter', function ($scope, $routeParams, $window, $filter) {
    $window.scrollTo(0, 0);
    var defaultView = "25";

    $scope.tab = 0;
    $scope.tabOptions = ['comments', 'submitted', 'gilded'];
    $scope.page = {};
    $scope.page.viewby = defaultView;
    $scope.page.items = parseInt(defaultView);
    $scope.page.max = 10;
    $scope.page.current = 1;

    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
    };

    $scope.isSet = function(num) {
      return $scope.tab === parseInt(num);
    };

    $scope.pageChanged = function() {
      $window.scrollTo(0, 200);
    };

    $scope.setItemsPerPage = function(num) {
      $scope.page.current = 1;
      $scope.page.items = num;
    };

    $scope.setSortOption = function() {
      $scope.page.current = 1;
    };

    $scope.getArray = function() {
      return $filter('sortPosts')($scope.sub.comments, $scope.data.selectedSort.value);
    };

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

    $scope.data = {
      sortOptions: [
        {value: 'newest', name: 'Newest'},
        {value: 'oldest', name: 'Oldest'},
        {value: 'mostUps', name: 'Most upvoted'},
        {value: 'mostDowns', name: 'Most controversial'},
      ],
      selectedSort: {value: 'newest', name: 'Newest'}
    };
  }]);
