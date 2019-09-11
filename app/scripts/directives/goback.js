'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:goBack
 * @description
 * # goBack
 */
angular.module('SubSnoopApp')
  .directive('goBack', function () {

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      template: '<span ng-click="goBack()" class="fa fa-long-arrow-left back-arrow go-back"></span>',
      restrict: 'E',
      controller: ['$scope','$window', function($scope, $window) {
        $scope.goBack = function() {
          $window.history.back();
        };
      }],
    };
  });
