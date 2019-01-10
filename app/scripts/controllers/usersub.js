'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserSubCtrl', ['$rootScope', '$scope', '$routeParams', '$window', '$filter', 'subsData', 'search',
    'subFactory', 'sortFactory', '$anchorScroll', '$location', '$timeout', 'subInfo', 'sentiMood', 'reaction',
    function ($rootScope, $scope, $routeParams, $window, $filter, subsData, search, subFactory, sortFactory, $anchorScroll, $location, $timeout, subInfo, sentiMood, reaction) {
    /*
     Initalization
    */
    $scope.subreddit = null;
    $scope.latestPost = null;
    $scope.firstPost = null;

    $window.scrollTo(0, 0);
    $scope.pages = ['comments', 'submissions', 'sub'];
    $scope.main = false;
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

    if ($scope.subreddit !== $routeParams.subreddit) {
      $scope.subreddit = $routeParams.subreddit;

      $scope.comments = $filter('sortPosts')($scope.comments, 'newest');
      $scope.submissions = $filter('sortPosts')($scope.submissions, 'newest');

      $scope.latestPost = subFactory.getLatestPost($scope.sub);
      $scope.firstPost = subFactory.getFirstPost($scope.sub);

      sentiMood.setSubData($scope.subreddit, $scope.sub, $scope.username);
      reaction.setSubData($scope.subreddit, $scope.sub, $scope.username);
    }

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
    $scope.sortSelected = sortFactory.getDefaultPostSort();
    $scope.commentSort = sortFactory.getDefaultPostSort();
    $scope.submitSort = sortFactory.getDefaultPostSort();

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.anchor = '';
    $scope.tabOptions = ['comments', 'submissions'];

    var baseUrl = '/' + $scope.username + '/' + $scope.subreddit;
    if ($location.path() === baseUrl + '/overview/') {
      $scope.tab = 2;
    } else if ($location.path() === baseUrl + '/submitted/') {
      $scope.tab = 1;
    } else if ($location.path() === baseUrl + '/comments/') {
      $scope.tab = 0;
    }

    $scope.page = $scope.pages[$scope.tab];
    $scope.open = false;

    $scope.sliceArray = function(data) {
      return data.slice((($scope.subPage.current-1)*$scope.subPage.items),
        (($scope.subPage.current)*$scope.subPage.items));

    };
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
      if ($scope.tab === 0) {
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
      $scope.open = $scope.tab === 2;
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

      if ($scope.tab === 0) {
        $scope.sortSelected = $scope.commentSort;
      } else {
        $scope.sortSelected = $scope.submitSort;
      }

      if (num == 3) {
        $window.location.assign('#/' + $scope.username + '/subreddits/');  // Go to user's main page
      } else if (num == 2) {
        $window.location.assign('#/' + $scope.username + '/' + $scope.subreddit + '/overview/');
      } else if (num == 1) {
        $window.location.assign('#/' + $scope.username + '/' + $scope.subreddit + '/submitted');
      } else if (num == 0) {
        $window.location.assign('#/' + $scope.username + '/' + $scope.subreddit + '/comments/');
      }
    };

    /*
     Set the page for pagination
    */
    $scope.setPage = function(num) {
      $scope.page = $scope.pages[num];
    }

    if ($scope.tab === 2) {
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
    } else if ($scope.tab < 2) {
      $scope.setArray();
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

      if ($scope.tab === 0) {
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

    /*
     Relocate to user's main page
     */
    $scope.goToSubs = function() {
      $window.location.assign('#/' + $scope.username + '/');
    }

    /*
     Refresh sub data
    */
    $scope.refreshData = function() {
      localStorage.clear();
      location.reload();
    }

  }
]);
