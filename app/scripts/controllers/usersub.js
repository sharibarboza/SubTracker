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
    'subFactory', 'sortFactory', '$anchorScroll', '$location', '$timeout', 'subInfo', 'sentiMood', 'reaction', 'userFactory',
    function ($rootScope, $scope, $routeParams, $window, $filter, subsData, search, subFactory, sortFactory, $anchorScroll, $location, $timeout, subInfo, sentiMood, reaction, userFactory) {
    /*
     Initalization
    */
    $scope.subreddit = null;
    $scope.latestPost = null;
    $scope.firstPost = null;

    $window.scrollTo(0, 0);
    $scope.main = false;
    $scope.username = $routeParams.username;
    $rootScope.title = $scope.username + ' | ' + $routeParams.subreddit;
    $scope.user = userFactory.getUser();

    var initLimit = 25;
    $scope.limit = initLimit;

    /*
     Set up for specific subreddit
     $scope.sub contains the comments and submissions arrays
    */
    $scope.subsArray = Object.keys(subsData.subs);
    $scope.sub = subsData.subs[$routeParams.subreddit];
    $scope.comments = [];
    $scope.submissions = [];
    $scope.comments = $scope.sub['comments'];
    $scope.submissions = $scope.sub['submissions'];
    $scope.numComments = $scope.comments.length;
    $scope.numSubmissions = $scope.submissions.length;
    $scope.limits = [0, 0, $scope.numSubmissions, $scope.numComments, 0];
    $scope.subInfo = null;
    $scope.gilded = $scope.sub.gilded_comments > 0 || $scope.sub.gilded_submissions > 0;
    $scope.gilds = getGildedPosts();

    if ($scope.subreddit !== $routeParams.subreddit) {
      $scope.subreddit = $routeParams.subreddit;

      //$scope.comments = $filter('sortPosts')($scope.comments, 'newest');
      //$scope.submissions = $filter('sortPosts')($scope.submissions, 'newest');

      $scope.latestPost = subFactory.getLatestPost($scope.sub);
      $scope.firstPost = subFactory.getFirstPost($scope.sub);

      sentiMood.setSubData($scope.subreddit, $scope.sub, $scope.username);
      reaction.setSubData($scope.subreddit, $scope.sub, $scope.username);
    }

    /*
     Set up for pagination of comments or submissions
    */
    $scope.sortSelected = sortFactory.getDefaultPostSort();
    $scope.commentSort = sortFactory.getDefaultPostSort();
    $scope.submitSort = sortFactory.getDefaultPostSort();
    $scope.gildSort = sortFactory.getDefaultPostSort();

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.anchor = '';
    $scope.tabOptions = ['subreddits', 'overview', 'posts', 'comments', 'gilded'];

    var baseUrl = '/' + $scope.username + '/' + $scope.subreddit;
    if ($location.path() === baseUrl + '/overview/') {
      $scope.tab = 1;
    } else if ($location.path() === baseUrl + '/submitted/') {
      $scope.tab = 2;
    } else if ($location.path() === baseUrl + '/comments/') {
      $scope.tab = 3;
    } else if ($location.path() === baseUrl + '/gilded/') {
      $scope.tab = 4;
    }

    $scope.open = false;

    $scope.sliceArray = function(data) {
      return data;
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
      if ($scope.tab === 3) {
        $scope.slicedArray = $scope.sliceArray($scope.comments);
      } else if ($scope.tab === 2) {
        $scope.slicedArray = $scope.sliceArray($scope.submissions);
      } else if ($scope.tab === 4) {
        $scope.slicedArray = $scope.sliceArray($scope.gilds);
      }

      if (top) {
        $scope.backUp();
      }
    };

    /*
     Set open/closed status of accordions
    */
    $scope.setAccordion = function() {
      $scope.open = $scope.tab === 1;
    };

    /*
     Update tab statics according to what the user clicked on
     Tab options are Subreddits, Overview, Comments, or Submitted
    */
    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
      $scope.setAccordion();

      if ($scope.tab === 3) {
        $scope.sortSelected = $scope.commentSort;
      } else if ($scope.tab === 2) {
        $scope.sortSelected = $scope.submitSort;
      } else if ($scope.tab === 4) {
        $scope.sortSelected = $scope.gildSort;
      }

      if (num == 0) {
        $location.path($scope.username + '/subreddits/');
      } else if (num == 1) {
        $location.update_path($scope.username + '/' + $scope.subreddit + '/overview/');
      } else if (num == 2) {
        $location.update_path($scope.username + '/' + $scope.subreddit + '/submitted');
      } else if (num == 3) {
        $location.update_path($scope.username + '/' + $scope.subreddit + '/comments/');
      } else if (num == 4) {
        $location.update_path($scope.username + '/' + $scope.subreddit + '/gilded/');
      }

      $scope.limit = initLimit;
      $scope.setArray();
    };

    if ($scope.tab > 0) {
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
    }

    if ($scope.tab > 1) {
      $scope.setArray();
    }

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
     Get all the gilded posts in the sub
    */
    function getGildedPosts() {
      var gilded = [];
      var posts = ($scope.comments).concat($scope.submissions);

      for (var i = 0; i < posts.length; i++) {
        if ($filter('gilded')(posts[i].gildings) > 0) {
          gilded.push(posts[i]);
        }
      }
      return gilded;
    }

    /*
     Used for sorting comments/submissions
    */
    $scope.data = sortFactory.getPostSorting();

    $scope.setSortOption = function(sort) {
      $scope.sortSelected = sort;

      if ($scope.tab === 3) {
        $scope.comments = $filter('sortPosts')($scope.sub['comments'], sort.value);
        $scope.commentSort = sort;
      } else if ($scope.tab === 2) {
        $scope.submissions = $filter('sortPosts')($scope.sub['submissions'], sort.value);
        $scope.submitSort = sort;
      } else if ($scope.tab === 4) {
        $scope.gilds = $filter('sortPosts')(getGildedPosts(), sort.value);
        $scope.gildSort = sort;
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
     Load more posts lazily
    */
    $scope.loadMore = function() {
      if ($scope.limit + initLimit < $scope.limits[$scope.tab]) {
        $scope.limit += initLimit;
      } else {
        $scope.limit = $scope.limits[$scope.tab];
      }
    }

  }
]);
