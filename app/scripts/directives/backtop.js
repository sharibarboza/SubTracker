'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:backTop
 * @description
 * # backTop
 */
angular.module('SubSnoopApp')
  .directive('backTop', function () {
    return {
      template: '<a href ng-click="backTop()"><i class="glyphicon glyphicon-arrow-up gray" aria-hidden="true"></i> Back to top</a>',
      restrict: 'E',
      controller: ['$scope', '$window', function($scope, $window) {
        $scope.backTop = function() {
          $window.scrollTo(0, 0);
        };
      }],
    };
  });
