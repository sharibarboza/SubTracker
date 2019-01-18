'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:stickyNav
 * @description
 * # stickyNav
 */
angular.module('SubSnoopApp')
  .directive('stickyNav', function ($window) {
    var $win = angular.element($window);

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var offsetTop = 250;
        var topClass = attrs.stickyNav;

        $win.on('scroll', function (e) {
          if ($win.scrollTop() >= offsetTop) {
            element.addClass(topClass);
          } else {
            element.removeClass(topClass);
          }
        });
      }
    };
  });
