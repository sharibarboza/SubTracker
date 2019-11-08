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
    'subFactory', 'sortFactory', '$location', '$timeout', 'subInfo', 'userFactory', 'recentTimes', 'filterPosts', 'gilded',
    function ($rootScope, $scope, $routeParams, $window, $filter, subsData, search, subFactory, sortFactory, $location, $timeout, subInfo, userFactory, recentTimes, filterPosts, gilded) {
    /*
     Initalization
    */
    $scope.subreddit = $routeParams.subreddit;
    $window.scrollTo(0, 0);
    $scope.main = false;
    $scope.username = $routeParams.username;
    $scope.user = userFactory.getUser();
    $scope.page = 'sub';
    $scope.listLoaded = false;
    $scope.loadingMore = false;

    var initLimit = 25;
    $scope.limit = initLimit;

    var titleRoot = $scope.username + ' | ' + $scope.subreddit + ' | ';
    var pageRoot = '/' + $scope.username + '/' + $scope.subreddit + '/';
    $rootScope.title = titleRoot + 'Overview';

    /*
     Set up for specific subreddit
     $scope.sub contains the comments and submissions arrays
    */
    $scope.subsArray = subFactory.getSubNames();
    $scope.sub = subFactory.getAllSubs()[$routeParams.subreddit];

    $scope.sortSelected = sortFactory.getDefaultPostSort();
    $scope.commentSort = $scope.sortSelected;
    $scope.submitSort = $scope.sortSelected;
    $scope.gildSort = $scope.sortSelected;

    $scope.comments = [];
    $scope.submissions = [];

    $scope.initComments = $scope.sub.num_comments;
    $scope.initSubmits = $scope.sub.num_submissions;
    $scope.numComments = $scope.sub.num_comments;
    $scope.numSubmits = $scope.sub.num_submissions;
    $scope.topPosts = [$scope.sub.top_comment[1], $scope.sub.top_submit[1]];
    $scope.total = $scope.numComments + $scope.numSubmits
    $scope.subInfo = null;
    $scope.selected = sortFactory.getSubSort();
    $scope.gilded = $scope.sub.gilded_comments > 0 || $scope.sub.gilded_submissions > 0;
    $scope.limits = [0, 0, $scope.numSubmits, $scope.numComments, 0];

    $scope.latestPost = recentTimes.getData($scope.username, $scope.subreddit, $scope.sub);
    $scope.recentlyActive = recentTimes.recentlyActive($scope.subreddit, 12);

    $scope.filterVal = filterPosts.getDefaultFilter();
    $scope.commentFilter = $scope.filterVal;
    $scope.submitFilter = $scope.filterVal;
    $scope.gildFilter = $scope.filterVal;
    $scope.initGilds = null;

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.tabOptions = ['subreddits', 'overview', 'posts', 'comments', 'gilded'];
    setTabNum();

    // Check for browser
    $scope.topFix = $filter('topfix')();

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

    $scope.slicedArray = [];

    /*
     Jump back to top of page after changing pages
    */
    $scope.backUp = function() {
      document.getElementById('table-start').scrollIntoView();
    };

    /*
     Used for sorting comments/submissions
    */
    $scope.data = sortFactory.getPostSorting();
    $scope.setSortOption = function(sort) {
      $scope.sortSelected = sort;

      if ($scope.tab === 3) {
        $scope.commentSort = sort;
      } else if ($scope.tab === 2) {
        $scope.submitSort = sort;
      } else if ($scope.tab === 4) {
        $scope.gildSort = sort;
      }

      $scope.limit = initLimit;
      $scope.setArray();
    };

    /*
     Set up the data array to be displayed based on the current tab and sort value.
     By default, comments are displayed first and all data is sorted by most recent.
    */
    $scope.setArray = function(top) {
      $scope.listLoaded = false;

      $timeout(function() {
        if ($scope.tab === 3) {
          setEntries('comments', $scope.commentFilter.value, $scope.commentSort.value);
          $scope.slicedArray = $scope.comments;
        } else if ($scope.tab === 2) {
          setEntries('submissions', $scope.submitFilter.value, $scope.submitSort.value);
          $scope.slicedArray = $scope.submissions;
        } else if ($scope.tab === 4) {
          setEntries('gilds', $scope.gildFilter.value, $scope.gildSort.value);
          $scope.slicedArray = $scope.gilds;
        }

        $scope.listLoaded = true;
        $scope.loadingMore = false;
      }, 200);

      if (top) {
        $scope.backUp();
      }
    };

    if ($scope.tab > 1) {
      $scope.setArray();
    }


    /*
     Update tab statics according to what the user clicked on
     Tab options are Subreddits, Overview, Comments, or Submitted
    */
    $scope.setTab = function(num) {
      $scope.tab = parseInt(num);

      if ($scope.tab === 3) {
        $scope.sortSelected = $scope.commentSort;
        $scope.filterVal = $scope.commentFilter;
      } else if ($scope.tab === 2) {
        $scope.sortSelected = $scope.submitSort;
        $scope.filterVal = $scope.submitFilter;
      } else if ($scope.tab === 4) {
        $scope.sortSelected = $scope.gildSort;
        $scope.filterVal = $scope.gildFilter;
      }

      updatePath(num);

      $scope.open = false;
      $scope.limit = initLimit;
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
     Filter posts based on time
    */
    $scope.filterPosts = filterPosts.getOptions();
    $scope.setFilterOption = function(filter) {
      filterPosts.setFilter(filter);
      $scope.filterVal = filter;

      if ($scope.tab === 3) {
        $scope.commentFilter = filter;
      } else if ($scope.tab === 2) {
        $scope.submitFilter = filter;
      } else if ($scope.tab === 4) {
        $scope.gildFilter = filter;
      }

      $scope.limit = initLimit;
      $scope.setArray();
    }

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
      $scope.loadingMore = true;

      if ($scope.limit + initLimit < $scope.limits[$scope.tab]) {
        $scope.limit += initLimit;
      } else {
        $scope.limit = $scope.limits[$scope.tab];
      }

      $scope.setArray();
    }

    /*
     Used for filtering subreddits by name
    */
    $scope.changeUserSubs = function(term) {
      var sortedList = sortFactory.getSorted($scope.selected.value);

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
     Set subs list for toggle sidebar
    */
    $scope.sideList = sortFactory.getSorted(sortFactory.getSubSort().value);
    if (!$scope.sideList) {
      $scope.sideList = $scope.subsArray;
    }

    /*
     Set up gilded posts
    */
    function setUpGilded() {
      if ($scope.initGilds == undefined || $scope.initGilds.length == 0) {
        var entries = subFactory.getEntries($scope.subreddit, null);
        var gildList = entries['comments'].concat(entries['submissions']);
        gilded.setData($scope.subreddit, gildList);
        $scope.gildData = gilded.getData($scope.subreddit);
        $scope.initGilds = $scope.gildData;
        $scope.gilds = $scope.initGilds;
        $scope.numGilds = $scope.initGilds.length;
      }

      $scope.limits[4] = $scope.numGilds;
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

          if (i == 4) {
            setUpGilded();
          }
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

    function setEntries(where, filter, sort) {
      var data;
      var entries;

      if (where === 'gilds' && !$scope.initGilds) {
        setUpGilded();
      }

      if (filterPosts.ifExists($scope.subreddit, filter, where)) {
        entries = filterPosts.getExistingData($scope.subreddit, filter, where, sort, $scope.limit);
      } else {
        if (where === 'gilds') {
          entries = filterPosts.getData(
            $scope.initGilds, filter, $scope.subreddit, sort, where, $scope.limit
          );
        } else {
          entries = filterPosts.getData(
            subFactory.getEntries($scope.subreddit, where),
            filter, $scope.subreddit, sort, where, $scope.limit
          );
        }
      }

      if (where === 'comments') {
        $scope.comments = entries;
        if (filter === 'all') {
          $scope.numComments = $scope.initComments;
          $scope.filterPoints = [$scope.sub.comment_ups, $scope.sub.avg_comments];
        } else {
          $scope.numComments = filterPosts.getLength($scope.subreddit, where, filter, sort);
          $scope.filterPoints = filterPosts.getPoints($scope.subreddit, where, filter);
        }
        $scope.limits[3] = $scope.numComments;
      } else if (where === 'submissions') {
        $scope.submissions = entries;
        if (filter === 'all') {
          $scope.numSubmits = $scope.initSubmits;
          $scope.filterPoints = [$scope.sub.submission_ups, $scope.sub.avg_submissions];
        } else {
          $scope.numSubmits = filterPosts.getLength($scope.subreddit, where, filter, sort);
          $scope.filterPoints = filterPosts.getPoints($scope.subreddit, where, filter);
        }
        $scope.limits[2] = $scope.numSubmits;
      } else if (where === 'gilds') {
        $scope.gilds = entries;
        if (filter === 'all') {
          $scope.numGilds = $scope.initGilds.length;
        } else {
          $scope.numGilds = filterPosts.getLength($scope.subreddit, where, filter, sort);
        }
        $scope.gildData = filterPosts.getGildStats($scope.subreddit, filter);
        $scope.limits[4] = $scope.numGilds;
      }
    }

  }
]);
