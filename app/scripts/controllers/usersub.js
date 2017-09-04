'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserSubCtrl', ['$scope', '$routeParams', '$window', '$filter', 'rank', 'subsData', 'search', 'subFactory', 'sortFactory', 
    function ($scope, $routeParams, $window, $filter, rank, subsData, search, subFactory, sortFactory) {
    
      /*
       Initalization
      */
      $window.scrollTo(0, 0);
      var defaultView = {value: '25', name: '25 options'};
      $scope.page = 'sub';
      $scope.subreddit = $routeParams.subreddit;
      $scope.username = $routeParams.username;

      /*
       Displays activity rank and upvotes rank of the specific subreddit relative to the user's
       other subreddits. This is what's displayed in the first sidebar card under the link to the
       subreddit's page.
      */
      rank.setData(subsData.subs);
      $scope.subLength = Object.keys(subsData.subs).length;
      $scope.mostActiveRank = rank.getSubRank($scope.subreddit, 'mostActive');
      $scope.mostUpsRank = rank.getSubRank($scope.subreddit, 'totalUps');

      /*
       Set up for specific subreddit
       $scope.sub contains the comments and submissions arrays
      */
      $scope.subsArray = Object.keys(subsData.subs);
      $scope.sub = subsData.subs[$scope.subreddit];

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

      /*
       Set up for pagination of comments or submissions
      */
      $scope.subPage = {};
      $scope.subPage.viewby = defaultView;
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
          $scope.subPage.items = $scope.subPage.viewby.num;
        }
        setArray();
      };

      /*
       Tab configuration for toggling between comment and submissions display
      */
      if ($scope.sub.comments.length > 0) {
        $scope.tab = 0;
      } else {
        $scope.tab = 1;
      }
      $scope.tabOptions = ['comments', 'submissions'];

      $scope.setTab = function(num) {
        $scope.tab = parseInt(num);
        $scope.subPage.current = 1;
        setArray()
      };

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
      $scope.data = {
        sortOptions: [
          {value: 'newest', name: 'Newest'},
          {value: 'oldest', name: 'Oldest'},
          {value: 'mostUps', name: 'Most upvoted'},
          {value: 'mostDowns', name: 'Most controversial'},
        ],
        selectedSort: {value: 'newest', name: 'Newest'}
      };

      $scope.setSortOption = function() {
        $scope.subPage.current = 1;
        setArray();
      };

      /*
       Determines how many comments/submissions to display on screen
       Default is set to 25
      */
      $scope.views = [
        {value: '25', num: 25},
        {value: '50', num: 50},
        {value: '100', num: 100},
        {value: 'All', num: 'All'}
      ];

      /*
       Set up the data array to be displayed based on the current tab and sort value.
       By default, comments are displayed first and all data is sorted by most recent.
      */
      var setArray = function() {
        $scope.dataArray = $scope.sub[$scope.tabOptions[$scope.tab]];
        $scope.elemArray = $filter('sortPosts')($scope.dataArray, $scope.data.selectedSort.value);
      };
      setArray();

      $scope.sort = sortFactory.getSubSort();
      $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.sort.value, subsData.subs);
      $scope.changeSubs = function(term) {
        $scope.subList = [];
        $scope.subList = search.findSubs($scope.subsArray, term);
      };

      /*
       Jump back to top of page after changing pages
      */
      $scope.backUp = function() {
        document.getElementById('table-start').scrollIntoView();
      }

    }
]);
