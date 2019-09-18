'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:subLine
 * @description
 * # subLine
 */
angular.module('SubSnoopApp')
  .directive('subLine', ['$compile', '$window', '$document', 'subFactory', 'months', 'moment', 'subChart', function ($compile, $window, $document, subFactory, months, moment, subChart) {
    var $win = angular.element($window);

    /*
     Stick the tab bar to the top after scrolling down
    */
    return {
      replace: true,
      scope: true,
      restrict: 'E',
      link: function(scope, element, attrs) {
        scope.labels = months.getLabels();
        scope.chartReady = false;
        var subs = subFactory.getSubData().subs[attrs.sub];

        scope.getChart = function() {
          subChart.getSubChart(scope.username, attrs.sub, subs);
          scope.series = ['Comment Points', 'Post Points'];
          scope.colors = ['#37AE9B', '#DCDCDC'];

          var data = subChart.getData(scope.subreddit);
          scope.totalUps = data.totalUps;
          scope.monthAverage = data.average;

          scope.data = [
            data.commentData,
            data.submissionData
          ];
          scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
          scope.options = {
            scales: {
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  display: true,
                  position: 'left',
                  ticks: {
                    fontColor: "#FFFFFF"
                  }
                },
                {
                  id: 'y-axis-2',
                  type: 'linear',
                  display: true,
                  position: 'right',
                  ticks: {
                    fontColor: "#FFFFFF"
                  }
                },
              ],
              xAxes: [
                {
                  ticks: {
                    fontColor: "#FFFFFF"
                  }
                }
              ]
            },
            legend: {
                display: true,
                labels:{
                    fontSize: 14,
                    fontColor: 'white',
                }
            },
          };

          scope.chartReady = true;
        };

        var offsetTop = null;
        $document.ready(function() {
          var middleCol = element.parent().parent();
          var prevElem = element.parent()[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .panel-body';

          var listener = scope.$watch(function() { return middleCol.find(idName).is(':visible') }, function() {
            var e = middleCol.find(idName);
            if (!scope.chartReady && e.length > 0) {
              var prev = middleCol.find('#top-entries-' + attrs.sub);
              offsetTop = prev[0].getBoundingClientRect().y + 50;

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
