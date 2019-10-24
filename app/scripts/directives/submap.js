'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:subMap
 * @description
 * # subMap
 */
angular.module('SubSnoopApp')
  .directive('subMap', ['$compile', '$window', '$document', 'subFactory', 'subHeatmap', function ($compile, $window, $document, subFactory, subHeatmap) {
    var $win = angular.element($window);

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      replace: true,
      scope: true,
      restrict: 'E',
      link: function(scope, element, attrs) {
        scope.chartReady = false;
        var subs = subFactory.getEntries(attrs.sub, null);

        scope.getChart = function() {
          scope.mapData = subHeatmap.getSubMap(scope.username, attrs.sub, subs);
          scope.average = subHeatmap.getAverage(attrs.sub);
          scope.total = subHeatmap.getTotal(attrs.sub);
          scope.chartReady = true;
        };

        $document.ready(function() {
          var prevElem = element.parent()[0].previousElementSibling;
          var idName;
          if (angular.element('#top-post-' + attrs.sub).length > 0) {
            idName = '#' + prevElem.id + ' .post-content';
          } else {
            idName = '#' + prevElem.id + ' .post-body';
          }

          var listener = scope.$watch(function() { return angular.element(idName).height() && angular.element(idName).height() > 0 }, function() {
            var e = angular.element(idName);
            if (!scope.chartReady && e.length > 0) {
              if (e.height() > 0) {
                console.log('yar!!');
                var boxTop = element[0].getBoundingClientRect().top + 100;
                $win.on('scroll', function (e) {
                  if (!scope.chartReady && ($win.scrollTop() + $win.height()) >= boxTop) {
                    scope.getChart();
                    scope.$apply();
                    return;
                  }
                });
              } else {
                var boxTop = prevElem.getBoundingClientRect().top;
                $win.on('scroll', function (e) {
                  var scrollY = $win.scrollTop() + 100;
                  if (!scope.chartReady && scrollY >= boxTop) {
                    scope.getChart();
                    scope.$apply();
                    return;
                  }
                });
              }
            }

          });

        });
      }
    };
  }]);
