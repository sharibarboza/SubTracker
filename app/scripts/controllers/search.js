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
      $scope.results = {'data':{}};
      $scope.resultList = [];
      $scope.type = 1;
      $scope.subs = [];
      $scope.checkedSub = "";
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

    $scope.addSub = function(sub) {
      var subIndex = $scope.subs.indexOf(sub);
      if (subIndex < 0) {
        $scope.subs.push(sub);
      } else {
        $scope.subs.splice(subIndex, 1);
      }
      $scope.filterResults($scope.type);
    };

    $scope.filterResults = function(type) {
      $scope.type = type;
      $scope.results = $filter('search')($scope.origResults, type, $scope.subs);
      $scope.resultList = $filter('sortSubs')(Object.keys($scope.results.data), 'subName', $scope.results.data);
      $scope.noResults = getNotFoundMsg();
    };

    $scope.checkType = function(type) {
      return $scope.type === type;
    };

    $scope.checkSub = function(sub) {
      return $scope.subs.indexOf(sub) >= 0;
    };

    $scope.searchResults = function() {
      $scope.searching = true;
      $timeout(function() { 
        resetFilters();
        $scope.origResults = searchResults.getData($scope.searchInput, $scope.dataSubs, $scope.type, $scope.subs);

        $scope.filterResults(1);
        $scope.searching = false;
      }, 200);
    };

    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }]);
