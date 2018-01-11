'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserSubCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$filter', 'rank', 'subsData', 'search', 
    'subFactory', 'sortFactory', '$anchorScroll', '$location', '$timeout', 'subInfo',
    function ($rootScope, $scope, $routeParams, $window, $filter, rank, subsData, search, subFactory, sortFactory, $anchorScroll, $location, $timeout, subInfo) {
  
    /*
     Initalization
    */
    $window.scrollTo(0, 0);
    $scope.pages = ['comments', 'submissions', 'sub'];
    $scope.page = $scope.pages[2];
    $scope.subreddit = $routeParams.subreddit;
    $scope.username = $routeParams.username;
    $rootScope.title = $scope.username + ' | ' + $scope.subreddit;

    /*
     Set up for specific subreddit
     $scope.sub contains the comments and submissions arrays
    */
    $scope.subsArray = Object.keys(subsData.subs);
    $scope.sub = subsData.subs[$scope.subreddit];
    $scope.latestPost = subFactory.getLatestPost($scope.sub);
    $scope.firstPost = subFactory.getFirstPost($scope.sub);

    /*
     Call subreddit API and get sub banner and icon
    */
    if ($scope.sub.info == null) {
      $scope.subInfo = subInfo.getData($scope.subreddit).then(function(response) {
        $scope.subInfo = response;
        subFactory.setSubInfo($scope.subreddit, response);
      });
    } else {
      $scope.subInfo = $scope.sub.info;
    }

    /*
     Get the comment with the most upvoteds
    */
    if ($scope.sub.comments.length > 0) {
      $scope.topPost = rank.getTopPost($scope.sub.comments, 'mostUps');
    }

    /*
     Get the submission with the most upvotes
    */
    if ($scope.sub.submissions.length > 0) {
      $scope.topSubmit = rank.getTopPost($scope.sub.submissions, 'mostUps');
    }

    $scope.highestPosts = [$scope.topSubmit, $scope.topPost];

    /*
     Determines how many comments/submissions to display on screen
     Default is set to 25
    */
    $scope.views = [25, 50, 100, 'All'];
    var defaultView = 25;

    /*
     Set up for pagination of comments or submissions
    */
    $scope.subPage = {};
    $scope.subPage.items = parseInt(defaultView);
    $scope.subPage.max = 7;
    $scope.subPage.current = 1;

    /*
     Used for setting how many items to view on screen at a time and also for pagination
    */
    $scope.setItemsPerPage = function(num) {
      $scope.subPage.current = 1;

      if (num === 'All') {
        $scope.subPage.items = $scope.sub[$scope.tabOptions[$scope.tab]].length;
      } else {
        $scope.subPage.items = num;
      }
      setArray();
    };

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.tab = 2;
    $scope.anchor = '';
    $scope.tabOptions = ['comments', 'submissions'];
    $scope.open = true;

    $scope.setAccordion = function() {
      $scope.open = $scope.tab === 2 ? true : false;
    };
    $scope.setAccordion();

    $scope.setTab = function(num) {
      $window.scrollTo(0, 0);
      $scope.tab = parseInt(num);
      $scope.subPage.current = 1;
      setArray();
      $scope.setAccordion();
      $scope.setPage(num);
    };

    $scope.setPage = function(num) {
      $scope.page = $scope.pages[num];
    }

    $scope.isSet = function(num) {
      return $scope.tab === parseInt(num);
    };

    $scope.getActive = function(num) {
      if ($scope.isSet(num)) {
        return { 'active': true };
      }
    };

    /*
     Used for sorting comments/submissions
    */
    $scope.data = sortFactory.getPostSorting();

    $scope.setSortOption = function(sort) {
      $scope.subPage.current = 1;
      $scope.sortSelected = sort;
      setArray();
    };

    $scope.sortSelected = {value: 'newest', name: 'Newest'};

    /*
     Set up the data array to be displayed based on the current tab and sort value.
     By default, comments are displayed first and all data is sorted by most recent.
    */
    var setArray = function() {
      $scope.dataArray = $scope.sub[$scope.tabOptions[$scope.tab]];
      $scope.elemArray = $filter('sortPosts')($scope.dataArray, $scope.sortSelected.value);
    };
    setArray();

    /*
     Sort subreddits when side nav is toggled
    */
    $scope.selected = sortFactory.getSubSort();
    $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.selected.value, subsData.subs);
    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

    /*
     Jump back to top of page after changing pages
    */
    $scope.backUp = function() {
      document.getElementById('table-start').scrollIntoView();
    };

    $scope.sliceArray = function() {
      $scope.slicedArray = $scope.elemArray.slice((($scope.subPage.current-1)*$scope.subPage.items), 
        (($scope.subPage.current)*$scope.subPage.items));
      return $scope.slicedArray;
    };

  }
]);
