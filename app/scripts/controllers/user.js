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
    $scope.currentLimit = 0;
    $scope.open = true;
    $scope.subLength = 0;

    if (subsData) {
      $scope.noSubs = Object.keys(subsData.subs).length === 0;
    } else {
      $scope.noSubs = true;
    }

    if ($location.path() === '/' + $scope.username + '/subreddits/') {
      $scope.tab = 0;
    } else {
      $scope.tab = 1;
    }

    $scope.tabOptions = ['subreddits', 'timeline', 'stats'];

    $scope.setTab = function(num) {
      $window.scrollTo(0, 0);
      $scope.tab = parseInt(num);

      if (num == 0) {
        $window.location.assign('#/' + $scope.username + '/subreddits/');  // Go to user's main page
      } else if (num == 1) {
        $window.location.assign('#/' + $scope.username + '/stats/');
      }
    };

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
      $scope.topComment = subsData.topComment;
      $scope.topSubmit = subsData.topSubmit;
    };

    /*
     Set the default sort of ranking the subreddits for a user's main page
     */
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
        $scope.currentLimit = $scope.subList.length;
      };
      setArray();

    } else {
      $scope.notfound = true;
      $scope.main = true;
      $rootScope.title = 'SubSnoop | User not found';
    }

    /*
     Find the subreddits that match the search query term
     */
    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
      $scope.currentLimit = $scope.subList.length;
    };

    /*
     Refresh sub data
    */
    $scope.refreshData = function() {
      localStorage.clear();
      location.reload();
    }
  }

]);
