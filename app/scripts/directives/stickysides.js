'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:stickySides
 * @description
 * # stickySides
 */
angular.module('SubSnoopApp')
  .directive('stickySides', function ($window) {
    var $win = angular.element($window);
    var offsetTop = 250;

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var topClass = attrs.stickySides;

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
