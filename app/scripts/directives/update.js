'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:update
 * @description
 * # update
 */
angular.module('SubSnoopApp')
  .directive('update', function () {

    /*
     Displays the button for 'updating data' on the side bar
     Clears session storage and refreshes the page
    */
    return {
      template: '<div class="card side-cards"><div class="card-content card-heading center cursor no-deco" ng-click="refresh()"><strong class="purple"><i class="fa fa-refresh" aria-hidden="true"></i> Update data</strong></div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.refresh = function() {
          sessionStorage.clear();
          window.location.reload();
        };
      }
    };
  });
