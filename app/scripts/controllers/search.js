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
    $scope.results = {};
    $scope.resultList = [];

    $scope.searchResults = function() {
      $scope.searching = true;
      $timeout(function() { 
        $scope.results = searchResults.getData($scope.searchInput, $scope.dataSubs);
        $scope.resultList = $filter('sortSubs')(Object.keys($scope.results), 'subName', $scope.results);
        $scope.searching = false;
      }, 200);
    };

    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }]);
