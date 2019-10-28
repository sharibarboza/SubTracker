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
        var username = scope.username;

        scope.getChart = function() {
          scope.mapData = userHeatmap.getUserMap(username, entries, null);
        	scope.count = userHeatmap.getCount();
          scope.average = userHeatmap.getAverage();
          scope.uniqueSubs = userHeatmap.getUniqueSubs();
          scope.chartReady = true;
        };

        angular.element($document).ready(function() {
          var chart = angular.element('#mapchart-' + username);
          var prevElem = element.parent()[0].previousElementSibling;
          var idName;
          if (angular.element('#top-post-' + scope.username).length > 0) {
            idName = '#' + prevElem.id + ' .post-content';
          } else {
            idName = '#' + prevElem.id + ' .post-body';
          }
          var winHeight = $win.innerHeight();

          var listener = scope.$watch(function() { return angular.element(idName).height() && angular.element(idName).height() > 0 }, function() {
            var e = angular.element(idName);

            if ((!scope.chartReady && e && e.length > 0)) {
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
