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
    $scope.sub = subsData.subs[$routeParams.subreddit];

    $scope.sortSelected = sortFactory.getDefaultPostSort();
    $scope.commentSort = $scope.sortSelected;
    $scope.submitSort = $scope.sortSelected;
    $scope.gildSort = $scope.sortSelected;

    $scope.entries = subFactory.getEntries($scope.subreddit, null);
    $scope.comments = $scope.entries['comments'];
    $scope.submissions = $scope.entries['submissions'];

    $scope.initComments = $scope.sub.num_comments;
    $scope.initSubmits = $scope.sub.num_submissions;
    $scope.numComments = $scope.sub.num_comments;
    $scope.numSubmissions = $scope.sub.num_submissions;
    $scope.topPosts = [$scope.sub.top_comment[1], $scope.sub.top_submit[1]];
    $scope.total = $scope.numComments + $scope.numSubmissions;
    $scope.subInfo = null;
    $scope.selected = sortFactory.getSubSort();
    $scope.gilded = $scope.sub.gilded_comments > 0 || $scope.sub.gilded_submissions > 0;
    $scope.limits = [0, 0, $scope.numSubmissions, $scope.numComments, 0];

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
        var entries = subFactory.getEntries($scope.subreddit, 'comments');
        $scope.comments = $filter('sortPosts')(entries, sort.value, $scope.subreddit, 'comments');
        if ($scope.commentFilter.value != 'all') {
          $scope.comments = filterComments($scope.commentFilter);
        }
      } else if ($scope.tab === 2) {
        $scope.submitSort = sort;
        var entries = subFactory.getEntries($scope.subreddit, 'submissions');
        $scope.submissions = $filter('sortPosts')(entries, sort.value, $scope.subreddit, 'submissions');
        if ($scope.submitFilter.value != 'all') {
          $scope.submissions = filterSubmits($scope.submitFilter);
        }
      } else if ($scope.tab === 4) {
        $scope.gilds = $filter('sortPosts')($scope.gilds, sort.value);
        gilded.setData($scope.subreddit, $scope.gilds, sort.value);
        $scope.gildSort = sort;
      }
      $scope.setArray();
    };

    /*
     Set up the data array to be displayed based on the current tab and sort value.
     By default, comments are displayed first and all data is sorted by most recent.
    */
    $scope.setArray = function(top) {
      if ($scope.tab === 3) {
        $scope.slicedArray = $scope.sliceArray($scope.comments);
        // Cache comments
        if (!(sortFactory.hasEntries($scope.subreddit, $scope.sortSelected.value, 'comments'))) {
          sortFactory.addEntries($scope.subreddit, $scope.sortSelected.value, 'comments', $scope.comments);
        }
      } else if ($scope.tab === 2) {
        $scope.slicedArray = $scope.sliceArray($scope.submissions);
        // Cache submissions
        if (!(sortFactory.hasEntries($scope.subreddit, $scope.sortSelected.value, 'submissions'))) {
          sortFactory.addEntries($scope.subreddit, $scope.sortSelected.value, 'submissions', $scope.submissions);
        }
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
        filterComments(filter);
      } else if ($scope.tab === 2) {
        filterSubmits(filter);
      } else if ($scope.tab === 4) {
        filterGilded(filter);
      }

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
     Find the subreddits that match the search query term
     */
    $scope.changeUserSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
      $scope.currentLimit = $scope.subList.length;
    };

    /*
     Set subs list for toggle sidebar
    */
    $scope.subList = sortFactory.getSorted(sortFactory.getSubSort().value);
    if (!$scope.subList) {
      $scope.subList = $scope.subsArray;
    }

    /*
     Filter comments based on time
    */
    function filterComments(filter) {
      var entries = sortFactory.getEntries($scope.subreddit, $scope.commentSort.value, 'comments');
      if (filter.value === 'all') {
        $scope.comments = entries;
        $scope.numComments = $scope.sub.num_comments;
      } else {
        $scope.comments = filterPosts.getData(entries, filter.value, $scope.subreddit, $scope.commentSort.value, 'comments');
        $scope.numComments = $scope.comments.length;
      }
      $scope.commentFilter = filter;
      $scope.limits[3] = $scope.numComments;

      return $scope.comments;
    }

    /*
     Filter submissions based on time
    */
    function filterSubmits(filter) {
      var entries = sortFactory.getEntries($scope.subreddit, $scope.submitSort.value, 'submissions');
      if (filter.value === 'all') {
        $scope.submissios = entries;
        $scope.numSubmissions = $scope.sub.num_submissions;
      } else {
        $scope.submissions = filterPosts.getData(entries, filter.value, $scope.subreddit, $scope.submitSort.value, 'submissions');
        $scope.numSubmissions = $scope.submissions.length;
      }
      $scope.submitFilter = filter;
      $scope.limits[2] = $scope.numSubmissions;

      return $scope.submissions;
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

  }
]);
