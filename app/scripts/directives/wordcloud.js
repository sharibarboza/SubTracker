'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:wordCloud
 * @description
 * # subLine
 */
angular.module('SubSnoopApp')
  .directive('wordCloud', ['$compile', '$window', '$document', 'subFactory', 'words', function ($compile, $window, $document, subFactory, words) {
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
        scope.colors = ['#f96854', '#97BBCD', '#3BC6D2', '#E975BF', '#C275E6', '#CDCB6A', '#3BA7A4', '#1DA1F2', '#E8E8E8', '#9099A1'];

        scope.getChart = function() {
          scope.words = words.getWords(attrs.sub, scope.username, subs);
          scope.chartReady = true;
        };

        $document.ready(function() {
          var prevElem = element.parent()[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .graph';

          var listener = scope.$watch(function() { return angular.element(idName).length > 1 }, function() {
            var e = angular.element(idName);

            if (!scope.chartReady && e[0]) {
              scope.getChart();
              return;
            }
          });

        });

      }
    };
  }]);
