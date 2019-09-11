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
      template: '<div class="btn gray-btn top-btn" ng-click="backTop()"><i class="fa fa-arrow-up" aria-hidden="true"></i> Back to top</div>',
      restrict: 'E',
      controller: ['$scope', '$window', function($scope, $window) {
        $scope.backTop = function() {
          $window.scrollTo(0, 0);
        };
      }],
    };
  });
