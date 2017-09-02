'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('UserCtrl', ['$scope', '$routeParams', '$filter', '$window', 'userFactory', 'subFactory', 'moment', 'subsData', 'search',
  function ($scope, $routeParams, $filter, $window, userFactory, subFactory, moment, subsData, search) {

    $window.scrollTo(0, 0);
    $scope.inputUser = $routeParams.username;
    var defaultSort = subFactory.getDefaultSort();
    $scope.main = false;
    $scope.page = 'user';
    $scope.sort = defaultSort;

    var configUserData = function(response, store) {
      $scope.redditor = response;
      $scope.username = $scope.redditor.name
      $scope.totalKarma = $scope.redditor.comment_karma + $scope.redditor.link_karma;
      $scope.notfound = false;

      if (store) {
        sessionStorage.user = $scope.username;
      }
    };

    var configSubData = function(response, store) {
      $scope.comments = response.comments;
      $scope.submissions = response.submissions;
      $scope.subs = response.subs;
      $scope.dataAvailable = response.firstDate;
      $scope.latest = response.latest;

      $scope.subsArray = $filter('sortSubs')(Object.keys($scope.subs), 'subName', $scope.subs);
      $scope.subLength = $scope.subsArray.length;

      if (store) {
        sessionStorage.sort = JSON.stringify(defaultSort);
      }

      subFactory.setSubs($scope.subs);
    };

    $scope.setSortOption = function() {
      sessionStorage.sort = JSON.stringify($scope.sortData.selectedSort);
      setArray();
    };

    if (subsData !== "") {
      $scope.notfound = false;
      if (subsData) {
        configUserData(subsData.user, true);
        configSubData(subsData, true);
      } else {
        subsData = JSON.parse(sessionStorage.subData);
        configUserData(subsData.user, false);
        configSubData(subsData, false);
      }

      if ('sort' in sessionStorage) {
        $scope.sort = JSON.parse(sessionStorage.sort);
      } else {
        $scope.sort = subFactory.getDefaultSort();
      }

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

      var setArray = function() {
        $scope.subList = $filter('sortSubs')($scope.subsArray, $scope.sortData.selectedSort.value, $scope.subs);
      };
      setArray();

    } else {
      $scope.notfound = true;
      $scope.main = true;
    }

    $scope.changeSubs = function(term) {
      $scope.subList = [];
      $scope.subList = search.findSubs($scope.subsArray, term);
    };

  }

]);