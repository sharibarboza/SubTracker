'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the SubSnoopApp
 */
angular.module('SubSnoopApp')
  .controller('SearchCtrl', ['$scope', 'searchResults', '$filter', 'search', 'subFactory', '$timeout', function ($scope, searchResults, $filter, search, subFactory, $timeout) {
  	$scope.searching = false;
    $scope.page = 'search';
    $scope.dataSubs = JSON.parse(sessionStorage.subData).subs;
    $scope.subsArray = Object.keys($scope.dataSubs);
    $scope.subList = $scope.subsArray;
    $scope.username = sessionStorage.user;

    if ('sort' in sessionStorage) {
    	$scope.sort = JSON.parse(sessionStorage.sort)
    } else {
    	$scope.sort = subFactory.getDefaultSort();
    }

    $scope.searchInput = "";
    $scope.noResults = "";

    var resetFilters = function() {
      $scope.results = {};
      $scope.resultList = $filter('sortSubs')($scope.subsArray, 'subName', $scope.dataSubs);
      $scope.type = 1;
      $scope.subs = [];
    };
    resetFilters();

    var getNotFoundMsg = function() {
      if ($scope.results.len == 0) {
        var typeStr = 'comments and submissions';
        if ($scope.type === 2) {
          typeStr = 'comments';
        } else if ($scope.type === 3) {
          typeStr = 'submissions';
        }
        return 'Sorry, no results could be found for "' + $scope.searchInput + '" in ' + $scope.username + "'s " + typeStr + '.';
      }
    };

    var getFilteredSubs = function() {
      var filteredSubs = [];
      for (var i = 0; i < $scope.resultList.length; i++) {
        var key = $scope.resultList[i];
        if ($scope.subs.length == 0 || $scope.subs.indexOf(key) >= 0) {
          filteredSubs.push(key);
        }
      }
      return filteredSubs;
    }

    var pushSub = function(sub) {
      var index = $scope.subs.indexOf(sub);
      if (index >= 0) {
        $scope.subs.splice(index, 1);
      } else {
        $scope.subs.push(sub);
      }
    };

    $scope.searchResults = function(type) {
      if (typeof type === "string") {
        pushSub(type);
      } else if (type === 0) {
        resetFilters();
      } else {
        $scope.type = type;
      }

      $scope.searching = true;
      $timeout(function() { 
        $scope.results = searchResults.getData($scope.searchInput, $scope.dataSubs, $scope.type, $scope.subs);
        $scope.resultList = $filter('sortSubs')(Object.keys($scope.results.data), 'subName', $scope.results.data);

        $scope.filteredList = getFilteredSubs();
        $scope.searching = false;

        $scope.noResults = getNotFoundMsg();
      }, 200);
    };

    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }]);
