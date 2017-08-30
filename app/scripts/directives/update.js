'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:update
 * @description
 * # update
 */
angular.module('SubSnoopApp')
  .directive('update', function () {
    return {
      template: '<div class="card"><div class="card-content card-heading center cursor no-deco" ng-click="refresh()"><strong class="purple"><i class="fa fa-refresh" aria-hidden="true"></i> Update data</strong></div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.refresh = function() {
          sessionStorage.clear();
          window.location.reload();
        };
      }
    };
  });
