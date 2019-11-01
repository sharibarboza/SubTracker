'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
  .controller('UserCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', 'subFactory', 'subsData', 'search', 'sortFactory', '$location', '$timeout',
  function ($rootScope, $scope, $routeParams, $filter, subFactory, subsData, search, sortFactory, $location, $timeout) {

    /*
     Initalization
    */
    $scope.username = $routeParams.username.trim();
    $scope.main = false; // Prevent hiding of search bar in top-nav
    $scope.page = 'user';
    $scope.open = false;
    $scope.subLength = 0;

    $scope.listLoaded = false;
    $scope.initLimit = 40;
    $scope.limit = $scope.initLimit;
    $scope.sortData = sortFactory.getSubSorting();
    $scope.selected = sortFactory.getSubSort();
    $scope.subList = [];
    var sortedList = [];

    if (subsData) {
      $scope.noSubs = subsData.subs === 0;
    } else {
      $scope.noSubs = true;
    }

    var titleRoot = $scope.username + ' | ';
    var pageRoot = '/' + $scope.username + '/';
    $scope.tabOptions = ['subreddits', 'statistics', 'search'];
    setTabNum();

    /*
     If user/sub data not stored in session storage, use data from resolved promises
    */
    if (subsData && subsData.subs > 0) {
      $scope.notfound = false;
      $scope.listLoaded = false;
      configUserData(subsData.user);
      configSubData(subsData);

      $timeout(function() {
        configSubList();
      }, 200);
    } else {
      $scope.notfound = true;
      $scope.main = true;
      $rootScope.title = 'SubSnoop | User Not Found';
    }

    /*
     Gets data from user's reddit about page, primarily for username, link karma, comment karma, etc.
     Stores user in session storage
     */
    function configUserData(response) {
      $scope.redditor = response;
      $scope.username = $scope.redditor.name;
      $scope.totalKarma = $scope.redditor.comment_karma + $scope.redditor.link_karma;
      $scope.notfound = false;
    };

    /*
     Gets data from user's comments and submitted page
     Sets up primary sub data
     Stores sort value in session storage
    */
    function configSubData(response) {
      $scope.comments = response.comments;
      $scope.submissions = response.submissions;
      $scope.upvotes = response.upvotes;
      $scope.latest = response.latest;
      $scope.subLength = response.subs;
      $scope.avgUpvotes = $filter('average')($scope.upvotes, $scope.subLength, 0);
      $scope.commentKarma = response.user.comment_karma;
      $scope.linkKarma = response.user.link_karma;
      $scope.topPosts = [subsData.topComment[2], subsData.topSubmit[2]];
    };

    /*
     Get the sorted subreddits to list
    */
    function configSubList() {
      sortedList = sortFactory.getSorted($scope.selected.value, $scope.limit);
      $scope.subList = subFactory.getSubs(sortedList);
      $scope.sideList = sortedList;
      $scope.listLoaded = true;
    }

    /*
     Handle tab change
    */
    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
      updatePath(num);
    };

    /*
     Used for filtering subreddits by name
    */
    $scope.changeUserSubs = function(term) {
      if (term == '') {
        $scope.subList = subFactory.getSubs(sortedList);
        $scope.sideList = sortedList;
      } else {
        var resultsList = search.findSubs(subFactory.getDefaultSortedArray(), term);
        $scope.subList = subFactory.getSubs(resultsList);
        $scope.sideList = resultsList;
      }
    };

    /*
     Set the default sort of ranking the subreddits for a user's main page
     */
    $scope.setSortOption = function(sort) {
      $scope.listLoaded = false;

      $filter('sortSubs')(subFactory.getSubNames(), sort.value, subFactory.getAllSubs());
      $scope.limit = $scope.initLimit;
      var sortedList = sortFactory.getSorted(sort.value, $scope.limit);

      $scope.subList = subFactory.getSubs(sortedList);
      sortFactory.setSubSort(sort);
      $scope.selected = sort;
      $scope.listLoaded = true;
    };

    /*
     Load more subs lazily
    */
    $scope.loadMore = function() {
      if ($scope.limit + $scope.initLimit < $scope.subLength) {
        $scope.limit += $scope.initLimit;
      } else {
        $scope.limit = $scope.subLength;
      }
      var sortedList = sortFactory.getSorted($scope.selected.value, $scope.limit);
      $scope.subList = subFactory.getSubs(sortedList);
    };

    /*
     Check the current URL path and set the title
    */
    function setTabNum() {
      for (var i = 0; i < $scope.tabOptions.length; i++) {
        var tabName = $scope.tabOptions[i];
        if (pageRoot + tabName + '/' === $location.path()) {
          $scope.tab = i;
          var tabTitle = tabName[0].toUpperCase() + tabName.slice(1, tabName.length);
          $rootScope.title = titleRoot + tabTitle;
          return;
        }
      }
    }

    /*
     Update the path upon a tab change
    */
    function updatePath(num) {
      var tabName = $scope.tabOptions[num];
      var tabTitle = tabName[0].toUpperCase() + tabName.slice(1, tabName.length);

      $rootScope.title = titleRoot + tabTitle;
      $location.update_path(pageRoot + tabName + '/');
    }

  }

]);
