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
    $scope.subreddit;
    $scope.latestPost;

    $window.scrollTo(0, 0);
    $scope.pages = ['comments', 'submissions', 'sub'];
    $scope.page = $scope.pages[2];
    $scope.username = $routeParams.username;
    $rootScope.title = $scope.username + ' | ' + $routeParams.subreddit;

    /*
     Set up for specific subreddit
     $scope.sub contains the comments and submissions arrays
    */
    $scope.subsArray = Object.keys(subsData.subs);
    $scope.sub = subsData.subs[$routeParams.subreddit];
    $scope.comments = $scope.sub['comments'];
    $scope.submissions = $scope.sub['submissions'];

    if ($scope.subreddit != $routeParams.subreddit) {
      $scope.subreddit = $routeParams.subreddit;
      $scope.latestPost = subFactory.getLatestPost($scope.sub);
      $scope.submissions = $filter('sortPosts')($scope.submissions, 'newest');
    }

    /*
     Determines how many comments/submissions to display on screen
     Default is set to 25
    */
    $scope.views = [10, 25, 50, 100, 'All'];
    var defaultView = 10;

    /*
     Set up for pagination of comments or submissions
    */
    $scope.subPage = {};
    $scope.subPage.items = parseInt(defaultView);
    $scope.subPage.max = 7;
    $scope.subPage.current = 1;
    $scope.sortSelected = sortFactory.getDefaultPostSort();
    $scope.commentSort = sortFactory.getDefaultPostSort();
    $scope.submitSort = sortFactory.getDefaultPostSort();

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.anchor = '';
    $scope.tabOptions = ['comments', 'submissions'];
    $scope.tab = 2;
    $scope.open = true;

    $scope.sliceArray = function(data) {
      return data.slice((($scope.subPage.current-1)*$scope.subPage.items), 
        (($scope.subPage.current)*$scope.subPage.items));

    }
    $scope.slicedArray = [];

    /*
     Jump back to top of page after changing pages
    */
    $scope.backUp = function() {
      document.getElementById('table-start').scrollIntoView();
    };

    /*
     Set up the data array to be displayed based on the current tab and sort value.
     By default, comments are displayed first and all data is sorted by most recent.
    */
    $scope.setArray = function(top) {
      if ($scope.tab == 0) {
        $scope.slicedArray = $scope.sliceArray($scope.comments);
      } else {
        $scope.slicedArray = $scope.sliceArray($scope.submissions);
      }

      if (top) {
        $scope.backUp();
      }
    };

    /*
     Set open/closed status of accordions
    */
    $scope.setAccordion = function() {
      $scope.open = $scope.tab === 2 ? true : false;
    };

    /*
     Update tab statics according to what the user clicked on
     Tab options are Subreddits, Overview, Comments, or Submitted
    */
    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
      $scope.subPage.current = 1;
      $scope.setAccordion();
      $scope.setPage(num);

      if ($scope.tab == 0) {
        $scope.sortSelected = $scope.commentSort;
      } else {
        $scope.sortSelected = $scope.submitSort;
      }

      if ($scope.tab < 2) {
        $scope.setArray();
      }
    };

    /*
     Set the page for pagination
    */
    $scope.setPage = function(num) {
      $scope.page = $scope.pages[num];
    }

    if ($scope.tab == 2) {
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

      $scope.setTab(2);
    }

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

      $scope.setArray();
    };

    /*
     Check whether the current tab is a certain number
    */
    $scope.isSet = function(num) {
      return $scope.tab === parseInt(num);
    };

    /*
     Get the current tab
    */
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

      if ($scope.tab == 0) {
        $scope.comments = $filter('sortPosts')($scope.sub['comments'], sort.value);
        $scope.commentSort = sort
      } else {
        $scope.submissions = $filter('sortPosts')($scope.sub['submissions'], sort.value);
        $scope.submitSort = sort;
      }

      $scope.setArray();
    };

    /*
     Sort subreddits when side nav is toggled
    */
    $scope.selected = sortFactory.getSubSort();
    $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.selected.value, subsData.subs);
    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }
]);
