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
        var subname = scope.subreddit;
        var username = scope.username;
        var subs = subFactory.getEntries(subname, null);

        scope.getChart = function() {
          scope.mapData = subHeatmap.getSubMap(username, subname, subs);
          scope.average = subHeatmap.getAverage(subname);
          scope.total = subHeatmap.getTotal(subname);
          scope.chartReady = true;
        };

        $document.ready(function() {
          var chart = angular.element('#mapchart-' + subname);
          var prevElem = element.parent()[0].previousElementSibling;
          var idName;
          if (angular.element('#top-post-' + subname).length > 0) {
            idName = '#' + prevElem.id + ' .post-content';
          } else {
            idName = '#' + prevElem.id + ' .post-body';
          }
          var winHeight = $win.innerHeight();

          var listener = scope.$watch(function() { return angular.element(idName).height() && angular.element(idName).height() > 0 }, function() {
            var e = angular.element(idName);
            if (!scope.chartReady && e && e.length > 0) {
              if (e[0].clientHeight > 0) {
                var boxTop = chart[0].offsetTop - winHeight + 50;
                $win.on('scroll', function (e) {
                  var scrollY = $win.scrollTop();
                  if (!scope.chartReady && (scrollY >= boxTop)) {
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
