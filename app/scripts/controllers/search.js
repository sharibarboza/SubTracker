'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SearchCtrl', ['$rootScope', '$scope', 'searchResults', '$filter', 'search', 'subFactory', '$timeout', 'subsData', 'sortFactory', 
  function ($rootScope, $scope, searchResults, $filter, search, subFactory, $timeout, subsData, sortFactory) {
    /* 
      Initalization
    */
    $scope.searching = false;  // For loading progression wheel
    $scope.page = 'search';
    $scope.dataSubs = subsData.subs;
    $scope.subsArray = Object.keys($scope.dataSubs);
    $scope.subList = $scope.subsArray;  // Used for collapsible sidenav
    $scope.username = subsData.user.name;
    $scope.searchInput = "";
    $scope.noResults = "";
    $rootScope.title = $scope.username + ' | Search';
    $scope.statuses = [];
    
    /*
     Reset post-type and subs array to default on new search
    */
    var resetFilters = function() {
      $scope.results = {'data':{}};
      $scope.resultList = [];
      $scope.rawResults = [];
      $scope.type = 1;
      $scope.subs = [];
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
        if ($scope.subs.length > 0) {
          subStr += 'in [';
          for (var i = 0; i < $scope.subs.length; i++) {
            var sub = '/r/' + $scope.subs[i]
            subStr += sub;
            if (i < $scope.subs.length - 1) {
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
      var subIndex = $scope.subs.indexOf(sub);
      if (subIndex < 0) {
        $scope.subs.push(sub);
      } else {
        $scope.subs.splice(subIndex, 1);
      }
      $scope.filterResults($scope.type);
    };

    /*
     Empty filtered subs array
    */
    $scope.deselect = function() {
      $scope.subs = [];
      $scope.filterResults($scope.type);
    };

    /*
     Main method for filtering results
     Stores results in new array, but keeps non-filtered data in origResults
    */
    $scope.filterResults = function(type) {
      $scope.type = type;
      $scope.results = $filter('search')($scope.origResults, type, $scope.subs);
      $scope.rawResults = $filter('sortSubs')(Object.keys($scope.results.data), 'subName', $scope.results.data);

      for (var i = 0; i < $scope.rawResults.length; i++) {
        var result = {};
        result.data = $scope.rawResults[i];
        result.status = false;
        $scope.resultList.push(result);
      }

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
      return $scope.subs.indexOf(sub) >= 0;
    };

    /*
     Called when new search is deployed
     Gives a sleep delay of at least 2 seconds every search to simulate loading
    */
    $scope.searchResults = function() {
      $scope.searching = true;
      $timeout(function() { 
        resetFilters();
        $scope.origResults = searchResults.getData($scope.searchInput, $scope.dataSubs, $scope.type, $scope.subs);

        $scope.filterResults(1);
        $scope.searching = false;
      }, 200);
    };

    /*
     Used in searching for subs in the sidenav
    */
    $scope.sort = sortFactory.getSubSort();
    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }]);
