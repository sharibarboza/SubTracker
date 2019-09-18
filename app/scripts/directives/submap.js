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
        var subs = subFactory.getSubData().subs[attrs.sub];

        scope.getChart = function() {
          scope.mapData = subHeatmap.getSubMap(scope.username, attrs.sub, subs);
          scope.average = subHeatmap.getAverage(attrs.sub);
          scope.total = subHeatmap.getTotal(attrs.sub);
          scope.chartReady = true;
        };

        var offsetTop = null;
        $document.ready(function() {
          var middleCol = element.parent().parent();
          var prevElem = element.parent()[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .graph';

          var listener = scope.$watch(function() { return middleCol.find(idName).is(':visible') }, function() {
            var e = middleCol.find(idName);
            if (!scope.chartReady && e.length > 0) {
              var entriesHeight = middleCol.find('#top-entries-' + attrs.sub)[0].clientHeight;
              offsetTop = entriesHeight + 50;

              $win.on('scroll', function (e) {
                if (!scope.chartReady && $win.scrollTop() >= offsetTop) {
                  scope.getChart();
                  scope.chartReady = true;
                  scope.$apply();
                  return;
                }
              });
            }
          });
        });
      }
    };
  }]);
