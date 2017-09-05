'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
  .controller('UserCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$window', 'subFactory', 'moment', 'subsData', 'search', 'sortFactory',
  function ($rootScope, $scope, $routeParams, $filter, $window, subFactory, moment, subsData, search, sortFactory) {

    /*
     Initalization
    */
    $window.scrollTo(0, 0);
    $scope.inputUser = $routeParams.username;
    $scope.main = false; // Prevent hiding of search bar in top-nav
    $scope.page = 'user';
    $scope.sort = sortFactory.getSubSort();

    /*
     Gets data from user's reddit about page, primarily for username, link karma, comment karma, etc.
     Stores user in session storage
     */
    var configUserData = function(response, store) {
      $scope.redditor = response;
      $scope.username = $scope.redditor.name
      $scope.totalKarma = $scope.redditor.comment_karma + $scope.redditor.link_karma;
      $scope.notfound = false;
    };

    /*
     Gets data from user's comments and submitted page
     Sets up primary sub data
     Stores sort value in session storage
    */
    var configSubData = function(response, store) {
      $scope.comments = response.comments;
      $scope.submissions = response.submissions;
      $scope.subs = response.subs;
      $scope.dataAvailable = response.firstDate;
      $scope.latest = response.latest;
      $scope.subsArray = $filter('sortSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
      $scope.subLength = $scope.subsArray.length;
    };

    $scope.setSortOption = function() {
      sortFactory.setSubSort($scope.sortData.selectedSort);
      setArray();
    };

    /*
     If user/sub data not stored in session storage, use data from resolved promises
    */
    if (subsData !== "") {
      $scope.notfound = false;
      if (subsData) {
        configUserData(subsData.user, false);
        configSubData(subsData, false);
        $rootScope.title = $scope.username + ' | Subreddits';
      }

      /*
       Used for sorting subreddits
      */
      $scope.sortData = {
        sortOptions: [
          {value: 'subName', name: 'Subreddit name'},
          {value: 'totalComments', name: 'Total comments'},
          {value: 'totalSubmits', name: 'Total submissions'},
          {value: 'totalUps', name: 'Total upvotes'},
          {value: 'lastSeen', name: 'Most recent activity'},
          {value: 'mostActive', name: 'Most activity'},
          {value: 'avgComment', name: 'Average upvotes per comment'},
          {value: 'avgSubmit', name: 'Average upvotes per submission'},
          {value: 'mostDown', name: 'Most controversial'},
        ],
        selectedSort: $scope.sort
      };

      /*
       Sorts array based on input sort value and sets up the sub array that will be display
       on the user's main page.
       By default, user's subs are sorted alphabetically by sub name
      */
      var setArray = function() {
        $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.sortData.selectedSort.value, $scope.subs);
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
    };
  }

]);