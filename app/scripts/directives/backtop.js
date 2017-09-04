'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:backTop
 * @description
 * # backTop
 */
angular.module('SubSnoopApp')
  .directive('backTop', function () {

    /*
     Jump back to top of page with a 'Back to Top' link and up-arrow
    */
    return {
      template: '<strong><i class="fa fa-arrow-up gray" aria-hidden="true"></i><a href class="purple" ng-click="backTop()"> Back to top</a></strong>',
      restrict: 'E',
      controller: ['$scope', '$window', function($scope, $window) {
        $scope.backTop = function() {
          $window.scrollTo(0, 0);
        };
      }],
    };
  });
