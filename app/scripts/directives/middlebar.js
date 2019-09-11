'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:middleBar
 * @description
 * # middleBar
 */
angular.module('SubSnoopApp')
  .directive('middleBar', function () {

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var parent = element.parent();
        var listener = scope.$watch(function() { return parent.is(':visible') }, function() {
          var width = parent[0].clientWidth;
          element.css('width', width + 'px');
          return
        });
      }
    };
  });
