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
    var bodyClass = 'top-fix-body';
    var offsetTop = 250;

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var topClass = attrs.stickyNav;
        var body = angular.element('.sub-table');

        $win.on('scroll', function (e) {
          if ($win.scrollTop() >= offsetTop) {
            element.addClass(topClass);
            body.addClass(bodyClass);
          } else {
            element.removeClass(topClass);
            body.removeClass(bodyClass);
          }
        });
      }
    };
  });
