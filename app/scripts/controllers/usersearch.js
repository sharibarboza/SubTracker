'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserSearchCtrl
 * @description
 * # UserSearchCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('UserSearchCtrl', ['$rootScope', '$scope', 'searchResults', '$filter', 'search', 'subFactory', '$timeout', 'sortFactory', 'userFactory',
  function ($rootScope, $scope, searchResults, $filter, search, subFactory, $timeout, sortFactory, userFactory) {

    /*
      Initalization
    */
    $scope.searching = false;  // For loading progression wheel
    $scope.main = false;
    $scope.page = 'search';
    $scope.entries = subFactory.getAllEntries();
    $scope.subsArray = Object.keys($scope.entries);
    $scope.searchList = $scope.subsArray;  // Used for collapsible sidenav
    $scope.searchInput = "";
    $scope.noResults = "";
    $scope.user = userFactory.getUser();
    $scope.results = {'data':{}};
    $scope.resultList = [];
    $scope.type = 1;
    $scope.searchSubs = [];
    $scope.hasResults = false;
    $scope.open = false;

    var initLimit = 10;
    $scope.searchLimit = initLimit;

    /*
     Reset post-type and subs array to default on new search
    */
    var resetFilters = function() {
      $scope.results = {'data':{}};
      $scope.resultList = [];
      $scope.type = 1;
      $scope.searchSubs = [];
    };
    resetFilters();

    /*
     Display static results not found message based on input and filters
    */
    var getNotFoundMsg = function() {
      if ($scope.results.len == 0) {
        var typeStr = 'comments and submissions';
        if ($scope.type === 2) {
          typeStr = 'comments';
        } else if ($scope.type === 3) {
          typeStr = 'submissions';
        }

        var subStr = '';
        if ($scope.searchSubs.length > 0) {
          subStr += 'in [';
          for (var i = 0; i < $scope.searchSubs.length; i++) {
            var sub = '/r/' + $scope.searchSubs[i];
            subStr += sub;
            if (i < $scope.searchSubs.length - 1) {
              subStr += ', '
            }
          }
          subStr += ']'
        }

        return 'Sorry, no results could be found ' + subStr + ' for "' + $scope.searchInput + '" in ' + $scope.username + "'s " + typeStr + '.';
      }
    };

    /*
     Checkbox click prompts new sub to be added to filtered subs array
    */
    $scope.addSub = function(sub) {
      var subIndex = $scope.searchSubs.indexOf(sub);
      if (subIndex < 0) {
        $scope.searchSubs.push(sub);
      } else {
        $scope.searchSubs.splice(subIndex, 1);
      }
      $scope.filterResults($scope.type);
    };

    /*
     Empty filtered subs array
    */
    $scope.deselect = function() {
      $scope.searchSubs = [];
      $scope.filterResults($scope.type);
    };

    /*
     Main method for filtering results
     Stores results in new array, but keeps non-filtered data in origResults
    */
    $scope.filterResults = function(type) {
      $scope.type = type;
      $scope.results = $filter('search')($scope.origResults, type, $scope.searchSubs);
      $scope.resultList = $filter('sortSubs')(Object.keys($scope.results.data), 'subName', $scope.results.data, false);
      $scope.noResults = getNotFoundMsg();
    };

    /*
     Checks the current radio button and passes true/false to ng-checked
    */
    $scope.checkType = function(type) {
      return $scope.type === type;
    };

    /*
     Checks the current checkbox and passes true/false to ng-checked
    */
    $scope.checkSub = function(sub) {
      return $scope.searchSubs.indexOf(sub) >= 0;
    };

    /*
     Called when new search is deployed
     Gives a sleep delay of at least 2 seconds every search to simulate loading
    */
    $scope.searchResults = function() {
      $scope.searchInput = this.searchInput;
      $scope.searching = true;
      $timeout(function() {
        resetFilters();
        $scope.origResults = searchResults.getData($scope.searchInput, $scope.entries);
        $scope.hasResults = Object.keys($scope.origResults['data']).length > 0;
        $scope.filterResults(1);
        $scope.searching = false;
      }, 200);
    };

    /*
     Used in searching for subs in the sidenav
    */
    $scope.sort = sortFactory.getSubSort();
    $scope.changeSubs = function(term) {
      $scope.searchList = [];
      $scope.searchList = search.findSubs($scope.subsArray, term);
    };

    /*
     Load more posts lazily
    */
    $scope.searchLoadMore = function(sub, type) {
      if ($scope.searchLimit + initLimit < $scope.results.data[sub][type].length) {
        $scope.searchLimit += initLimit;
      } else {
        $scope.searchLimit = $scope.results.data[sub][type].length;
      }
    }

    $scope.searchResetLimit = function() {
      $scope.searchLimit = initLimit;
    }

  }]);
