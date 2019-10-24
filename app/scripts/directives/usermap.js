'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:userMap
 * @description
 * # userMap
 */
angular.module('SubSnoopApp')
  .directive('userMap', ['$compile', '$window', '$document', 'userHeatmap', 'subFactory', function ($compile, $window, $document, userHeatmap, subFactory) {
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
        var entries = subFactory.getAllEntries();

        scope.getChart = function() {
          scope.mapData = userHeatmap.getUserMap(scope.username, entries, null);
        	scope.count = userHeatmap.getCount();
          scope.average = userHeatmap.getAverage();
          scope.uniqueSubs = userHeatmap.getUniqueSubs();
          scope.chartReady = true;
        };

        $document.ready(function() {
          var prevElem = element.parent()[0].previousElementSibling;
          var idName;
          if (angular.element('#top-post-' + scope.username).length > 0) {
            idName = '#' + prevElem.id + ' .post-content';
          } else {
            idName = '#' + prevElem.id + ' .post-body';
          }

          var listener = scope.$watch(function() { return angular.element(idName).height() && angular.element(idName).height() > 0 }, function() {
            var e = angular.element(idName);
            var scrollHeight = $document[0].documentElement.scrollHeight;

            if (!scope.chartReady && e.length > 0) {
              if (e[0].clientHeight > 0) {
                var boxTop = element[0].getBoundingClientRect().top + 100;
                $win.on('scroll', function (e) {
                  if (!scope.chartReady && ($win.scrollTop() + $win.height()) >= boxTop) {
                    scope.getChart();
                    scope.$apply();
                    return;
                  }
                });
              } else {
                var boxTop = prevElem.getBoundingClientRect().top - 100;
                $win.on('scroll', function (e) {
                  var scrollY = $win.scrollTop();
                  if (!scope.chartReady && (scrollY >= boxTop || scrollY >= scrollHeight)) {
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
