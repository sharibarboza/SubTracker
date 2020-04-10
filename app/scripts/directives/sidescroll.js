'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:sideScroll
 * @description
 * # sideScroll
 */
angular.module('SubSnoopApp')
  .directive('sideScroll', function ($window) {
    var $win = angular.element($window);

    function getOffset(el) {
      el = el[0].getBoundingClientRect();
      return {
        left: el.left + $win[0].scrollX,
        top: el.top + $win[0].scrollY
      }
    }

    function getHeight(el) {
      return el[0].getBoundingClientRect().height;
    }

    function setStyle(el, prop) {
      for (var p in prop) {
        el.css(p, prop[p]);
      }
    }

    /*
     Creates a sticky sidebar that scrolls and then becomes fixed at the bottom
     Taken from https://github.com/ismailfarooq/simple-sticky-sidebar/blob/master/js/simple-sticky-sidebar.js
    */
    return {
      restrict: 'AE',
      link: function(scope, element, attrs) {
        var container = angular.element('.sidebar-outer');
        var lastScrollVal = 0;
        var topSpace = 0;
        var bottomSpace = 20;
        var bottomFixed = false;
        var topFixed = false;
        var offsetTop = getOffset(element).top;

        $win.on('scroll', function (e) {
          var stickyHeight = getHeight(element);
          var offsetLeft = getOffset(element).left;
          var offsetBottom = getOffset(element).top + getHeight(element);
          var scrollTop = $win.scrollTop();
          var stickyWidth = element[0].getBoundingClientRect().width;

          if (scrollTop > offsetTop - topSpace) {
            if (getHeight(element) <= $win.innerHeight() - topSpace) {
              setStyle(element, {
                top: topSpace + 'px',
                left: offsetLeft + 'px',
                bottom: '',
                width: stickyWidth + 'px',
                position: 'fixed'
              });
            } else {
              // Scrolling down
              if (scrollTop > lastScrollVal) {
                if (topFixed) {
                  var absoluteTop = getOffset(element).top;
                  setStyle(element, {
                    top: absoluteTop + 'px',
                    left: '',
                    bottom: '',
                    width: stickyWidth + 'px',
                    position: 'absolute'
                  });
                  topFixed = false;
                }

                if (scrollTop > offsetBottom - $win.innerHeight()) {
                  setStyle(element, {
                    top: '',
                    left: offsetLeft + 'px',
                    bottom: bottomSpace + 'px',
                    width: stickyWidth + 'px',
                    position: 'fixed'
                  });
                  bottomFixed = true;
                }
              } else {
                // Scrolling up
                var absoluteTop = getOffset(element).top;
                if (bottomFixed) {
                  setStyle(element, {
                    top: absoluteTop + 'px',
                    left: '',
                    bottom: '',
                    width: stickyWidth + 'px',
                    position: 'absolute'
                  });
                  bottomFixed = false;
                }

                if (scrollTop < absoluteTop - topSpace) {
                  setStyle(element, {
                    top: topSpace + 'px',
                    left: offsetLeft + 'px',
                    bottom: '',
                    width: stickyWidth + 'px',
                    position: 'fixed'
                  });
                  topFixed = true;
                }
              }

              lastScrollVal = scrollTop;
            }

          } else {
            setStyle(element, {
              top: '',
              left: '',
              bottom: '',
              width: '',
              position: ''
            });
          }


        });
      }
    };
  });
