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
    'subFactory', 'sortFactory', '$anchorScroll', '$location', '$timeout', 'subInfo', 'sentiMood', 'reaction', 'userFactory', 'recentTimes', 'filterPosts', 'gilded',
    function ($rootScope, $scope, $routeParams, $window, $filter, subsData, search, subFactory, sortFactory, $anchorScroll, $location, $timeout, subInfo, sentiMood, reaction, userFactory, recentTimes, filterPosts, gilded) {
    /*
     Initalization
    */
    $scope.subreddit = $routeParams.subreddit;
    $window.scrollTo(0, 0);
    $scope.main = false;
    $scope.username = $routeParams.username;
    $scope.user = userFactory.getUser();
    $scope.page = 'sub';

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

    sentiMood.setSubData($scope.subreddit, subFactory.getEntries($scope.subreddit, null), $scope.username);
    reaction.setSubData($scope.subreddit, subFactory.getEntries($scope.subreddit, null), $scope.username);

    $scope.filterVal = filterPosts.getDefaultFilter();
    $scope.commentFilter = $scope.filterVal;
    $scope.submitFilter = $scope.filterVal;
    $scope.gildFilter = $scope.filterVal;

    /*
     Tab configuration for toggling between comment and submissions display
    */
    $scope.anchor = '';
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
        $scope.gilds = $filter('sortPosts')($scope.gilds, sort.value);
        gilded.setData($scope.subreddit, $scope.gilds, sort.value);
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
      if ($scope.tab === 3) {
        setEntries('comments', $scope.commentFilter.value, $scope.commentSort.value);
        $scope.slicedArray = $scope.sliceArray($scope.comments);
      } else if ($scope.tab === 2) {
        setEntries('submissions', $scope.submitFilter.value, $scope.submitSort.value);
        $scope.slicedArray = $scope.sliceArray($scope.submissions);
      } else if ($scope.tab === 4) {
        $scope.slicedArray = $scope.sliceArray($scope.gilds);
      }

      if (top) {
        $scope.backUp();
      }
    };

    if ($scope.tab > 1) {
      $scope.setArray();
    }

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
        $scope.filterVal = $scope.commentFilter;
      } else if ($scope.tab === 2) {
        $scope.sortSelected = $scope.submitSort;
        $scope.filterVal = $scope.submitFilter;
      } else if ($scope.tab === 4) {
        $scope.sortSelected = $scope.gildSort;
        $scope.filterVal = $scope.gildFilter;
        setUpGilded();
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
        filterGilded(filter);
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
     Filter gilded posts based on time
    */
    function filterGilded(filter) {
      if (filter.value === 'all') {
        setUpGilded();
      } else {
        var entries = gilded.getData($scope.subreddit, $scope.gildSort.value);
        $scope.gilds = filterPosts.getData(entries, filter.value, $scope.subreddit, true);
        $scope.numGilds = $scope.gilds.length;
      }
      $scope.gildFilter = filter;
    }

    /*
     Set up gilded posts
    */
    function setUpGilded() {
      if ($scope.gilds == undefined || $scope.gilds.length == 0) {
        var entries = subFactory.getEntries($scope.subreddit, null);
        var gildList = entries['comments'].concat(entries['submissions']);
        gilded.setData($scope.subreddit, gildList, $scope.gildSort.value);
        $scope.gilds = gilded.getData($scope.subreddit, $scope.gildSort.value);
      }

      $scope.numGilds = $scope.gilds.length;
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
      var entries = filterPosts.getData(
        subFactory.getEntries($scope.subreddit, where),
        filter,
        $scope.subreddit,
        sort,
        where,
        $scope.limit
      );

      if (where === 'comments') {
        $scope.comments = entries;
        if (filter === 'all') {
          $scope.numComments = $scope.initComments;
        } else {
          $scope.numComments = filterPosts.getLength($scope.subreddit, where, filter, sort);
        }
        $scope.limits[3] = $scope.numComments;
      } else if (where === 'submissions') {
        $scope.submissions = entries;
        if (filter === 'all') {
          $scope.numSubmits = $scope.initSubmits;
        } else {
          $scope.numSubmits = filterPosts.getLength($scope.subreddit, where, filter, sort);
        }
        $scope.limits[2] = $scope.numSubmits;
      }
    }

  }
]);
