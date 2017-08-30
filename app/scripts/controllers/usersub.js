'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UsersubCtrl
 * @description
 * # UsersubCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserSubCtrl', ['$scope', '$routeParams', '$window', '$filter', 'rank', 'subsData', 
    function ($scope, $routeParams, $window, $filter, rank, subsData) {
    
    $window.scrollTo(0, 0);

    var defaultView = {value: '25', name: '25 options'};

    $scope.subreddit = $routeParams.subreddit;
    $scope.username = $routeParams.username;

    if (subsData) {
      sessionStorage.user = subsData.user.name;
      sessionStorage.sort = JSON.stringify({value: 'subName', name: 'Subreddit name'});
      sessionStorage.subData = JSON.stringify(subsData);
    } else {
      subsData = JSON.parse(sessionStorage.subData);
    }
    
    $scope.sub = subsData.subs[$scope.subreddit];
    if ($scope.sub.comments.length > 0) {
      $scope.topPost = rank.getTopPost($scope.sub.comments, 'mostUps');
    }

    if ($scope.sub.submissions.length > 0) {
      $scope.topSubmit = rank.getTopPost($scope.sub.submissions, 'mostUps');
    }

    $scope.subPage = {};
    $scope.subPage.viewby = defaultView;
    $scope.subPage.items = parseInt(defaultView);
    $scope.subPage.max = 7;
    $scope.subPage.current = 1;

    if ($scope.sub.comments.length > 0) {
      $scope.tab = 0;
    } else {
      $scope.tab = 1;
    }
    $scope.tabOptions = ['comments', 'submissions'];

    $scope.data = {
      sortOptions: [
        {value: 'newest', name: 'Newest'},
        {value: 'oldest', name: 'Oldest'},
        {value: 'mostUps', name: 'Most upvoted'},
        {value: 'mostDowns', name: 'Most controversial'},
      ],
      selectedSort: {value: 'newest', name: 'Newest'}
    };

    $scope.views = [
      {value: '25', num: 25},
      {value: '50', num: 50},
      {value: '100', num: 100},
      {value: 'All', num: 'All'}
    ];

    rank.setData(subsData.subs);
    $scope.subLength = rank.getSubLength();
    $scope.mostActiveRank = rank.getSubRank($scope.subreddit, 'mostActive');
    $scope.mostUpsRank = rank.getSubRank($scope.subreddit, 'totalUps');

    var setArray = function() {
      $scope.dataArray = $scope.sub[$scope.tabOptions[$scope.tab]];
      $scope.elemArray = $filter('sortPosts')($scope.dataArray, $scope.data.selectedSort.value);
    };
    setArray();

    $scope.setTab = function(num) {
      console.log(num);
      $scope.tab = parseInt(num);
      $scope.subPage.current = 1;
      setArray()
    };

    $scope.isSet = function(num) {
      return $scope.tab === parseInt(num);
    };

    $scope.setItemsPerPage = function(num) {
      $scope.subPage.current = 1;

      if (num === 'All') {
        $scope.subPage.items = $scope.sub[$scope.tabOptions[$scope.tab]].length;
      } else {
        $scope.subPage.items = $scope.subPage.viewby.num;
      }
      setArray();
    };

    $scope.setSortOption = function() {
      $scope.subPage.current = 1;
      setArray();
    };

    $scope.getActive = function(num) {
      if ($scope.isSet(num)) {
        return { 'active': true };
      }
    };
  }]);
