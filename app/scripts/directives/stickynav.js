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

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var topClass = attrs.stickyNav;
        var body = angular.element('.sub-table');

        var offsetTop = 400;
        if (topClass === 'top-fix-safari') {
          offsetTop = 274;
        }

        var topBtn = angular.element('.top-btn');


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
            body.addClass(bodyClass);
            topBtn.show();
          } else {
            element.removeClass(topClass);
            body.removeClass(bodyClass);
            topBtn.hide();
          }
        });

      }
    };
  });
