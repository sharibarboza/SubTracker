'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
  .controller('UserCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', '$window', 'subFactory', 'moment', 'subsData', 'search', 'sortFactory', '$location', 'subInfo', '$anchorScroll', 'badges', 'recentTimes',
  function ($rootScope, $scope, $routeParams, $filter, $window, subFactory, moment, subsData, search, sortFactory, $location, subInfo, $anchorScroll, badges, recentTimes) {

    /*
     Initalization
    */
    $window.scrollTo(0, 0);
    $scope.username = $routeParams.username.trim();
    $scope.main = false; // Prevent hiding of search bar in top-nav
    $scope.page = 'user';
    $scope.currentLimit = 0;
    $scope.open = false;
    $scope.subLength = 0;

    var initLimit = 40;
    $scope.limit = initLimit;

    if (subsData) {
      $scope.noSubs = Object.keys(subsData.subs).length === 0;
    } else {
      $scope.noSubs = true;
    }

    var titleRoot = $scope.username + ' | ';
    var pageRoot = '/' + $scope.username + '/';
    $scope.tabOptions = ['subreddits', 'statistics', 'search'];
    setTabNum();

    // Check for browser
    $scope.topFix = $filter('topfix')();
    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);
      $window.scrollTo(0, 0);

      updatePath(num);
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
      $scope.upvotes = response.upvotes;
      $scope.latest = response.latest;
      $scope.subsArray = subFactory.getDefaultSortedArray();
      $scope.subLength = subFactory.getSubLength();
      $scope.avgUpvotes = $filter('average')($scope.upvotes, $scope.subLength, 0);
      $scope.commentKarma = response.user.comment_karma;
      $scope.linkKarma = response.user.link_karma;
      $scope.topPosts = [subsData.topComment[2], subsData.topSubmit[2]];

      //$scope.subBadges = badges.getAllSubs($scope.username);
      $scope.subs = response.subs;
      for (var key in $scope.subs) {
        if (!$scope.subs[key].icon || $scope.subs[key].info == null) {
          subInfo.getData(key).then(function(response) {
            var sub = response.display_name;
            subFactory.setIcons(sub, response.icon_img);
            subFactory.setSubInfo(sub, response);
          });
        }
      }
      $scope.subs = subFactory.getSubData().subs;
      var subBadges = badges.getBadges($scope.username);
      var lastSeen = subBadges['lastSeen'].sub;

      recentTimes.getData($scope.username, lastSeen, $scope.subs[lastSeen]);
      $scope.recentlyActive = recentTimes.recentlyActive(lastSeen, 6);
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
        $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.selected.value, $scope.subs, true);
      };
      setArray();

    } else {
      $scope.notfound = true;
      $scope.main = true;
      $rootScope.title = 'SubSnoop | User Not Found';
    }

    /*
     Find the subreddits that match the search query term
     */
    $scope.changeUserSubs = function(term) {
      if (term == '') {
        setArray();
      } else {
        $scope.subList = [];
        $scope.subList = search.findSubs($scope.subsArray, term);
        $scope.currentLimit = $scope.subList.length;
      }
    };

    /*
     Load more subs lazily
    */
    $scope.loadMore = function() {
      if ($scope.limit + initLimit < $scope.subLength) {
        $scope.limit += initLimit;
      } else {
        $scope.limit = $scope.subLength;
      }
    }

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
