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

    /*
     Fixes the side box content in position when scrolling down.
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var topClass = attrs.stickySides;
        var offsetTop = 200;

        if (attrs.type == "sub") {
          var listener = scope.$watch(function() { return angular.element('.bg-banner').is(':visible') }, function() {
            var banner = angular.element('.bg-banner');

            if (banner.length > 0) {
              var height = banner[0].clientHeight;
              if (height > 0) {
                offsetTop = height;
              }
            }
          });
        }

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
