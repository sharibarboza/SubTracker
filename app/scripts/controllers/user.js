'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
  .controller('UserCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$window', 'subFactory', 'moment', 'subsData', 'search', 'sortFactory', '$location', '$anchorScroll',
  function ($rootScope, $scope, $routeParams, $filter, $window, subFactory, moment, subsData, search, sortFactory, $location, $anchorScroll) {
    /*
     Initalization
    */
    $window.scrollTo(0, 0);
    $scope.username = $routeParams.username;
    $scope.main = false; // Prevent hiding of search bar in top-nav
    $scope.page = 'user';
    $scope.limit = 20;
    $scope.currentLimit = $scope.limit;
    $scope.open = true;
    $scope.subLength = 0;

    if (subsData) {
      $scope.noSubs = Object.keys(subsData.subs).length == 0;
    } else {
      $scope.noSubs = true;
    }

    /*
     Gets data from user's reddit about page, primarily for username, link karma, comment karma, etc.
     Stores user in session storage
     */
    var configUserData = function(response) {
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
    var configSubData = function(response) {
      $scope.comments = response.comments;
      $scope.submissions = response.submissions;
      $scope.subs = response.subs;
      $scope.latest = response.latest;
      $scope.subsArray = subFactory.getDefaultSortedArray();
      $scope.subLength = subFactory.getSubLength();
      $scope.lastPost = subFactory.getLatestPost(null);
      $scope.firstPost = subFactory.getFirstPost(null);
    };

    $scope.setSortOption = function(sort) {
      sortFactory.setSubSort(sort);
      $scope.selected = sort;
      setArray();
    };

    /*
     If user/sub data not stored in session storage, use data from resolved promises
    */
    if (subsData && Object.keys(subsData.subs).length > 0) {
      $scope.notfound = false;
      $rootScope.title = $scope.username + ' | Subreddits';
      $scope.fetchTime = subFactory.getFetchTime();

      configUserData(subsData.user);
      configSubData(subsData);

      /*
       Used for sorting subreddits
      */
      $scope.sortData = sortFactory.getSubSorting();
      $scope.selected = sortFactory.getSubSort();

      /*
       Sorts array based on input sort value and sets up the sub array that will be display
       on the user's main page.
       By default, user's subs are sorted alphabetically by sub name
      */
      var setArray = function() {
        $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.selected.value, $scope.subs);
      };
      setArray();

    } else {
      $scope.notfound = true;
      $scope.main = true;
      $rootScope.title = 'SubSnoop | User not found';
    }

    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
      $scope.currentLimit = $scope.subList.length;
    };

    $scope.changeLimit = function() {
      if ($scope.currentLimit === $scope.subLength) {
        $scope.currentLimit = $scope.limit;
      } else {
        $scope.currentLimit = $scope.subLength;
      }
    };

    $scope.scrollAnchor = function(id) {
      $location.hash(id);
      $anchorScroll.yOffset = 120;
      $anchorScroll();
    };

    $scope.getRandomSub = function() {
      var randomSub = subFactory.getRandomSub();
      var url = '#/' + $scope.username + '/' + randomSub + '/';
      $window.location.href = url;
    }

    $scope.isToday = function(date) {
      return $filter('today')(date);
    }
  }

]);