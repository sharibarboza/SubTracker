'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:userMap
 * @description
 * # userMap
 */
angular.module('SubSnoopApp')
  .directive('userMap', ['$compile', '$window', '$document', 'subFactory', 'userHeatmap', function ($compile, $window, $document, subFactory, userHeatmap) {
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
        var subs = subFactory.getSubData().subs;

        scope.getChart = function() {
          scope.mapData = userHeatmap.getUserMap(scope.username, subs, null);
        	scope.count = userHeatmap.getCount();
          scope.subAverage = userHeatmap.getAverage();
          scope.chartReady = true;
        };

        $document.ready(function() {
          var middleCol = element.parent().parent();
          var prevElem = element.parent()[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .graph';

          var listener = scope.$watch(function() { return middleCol.find(idName).height() > 0 }, function() {
            var e = middleCol.find(idName);

            if (!scope.chartReady && e.length > 0 && e[0].clientHeight > 0) {
              var entriesHeight = middleCol.find('#top-entries-' + attrs.user)[0].clientHeight;
              var offsetTop = entriesHeight + 50;

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
