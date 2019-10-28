'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:userLine
 * @description
 * # userLine
 */
angular.module('SubSnoopApp')
  .directive('userLine', ['$compile', '$window', '$document', 'subFactory', 'months', 'moment', 'userChart', function ($compile, $window, $document, subFactory, months, moment, userChart) {
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
        var entries = subFactory.getAllEntries();
        var username = scope.username;

        scope.getChart = function() {
          userChart.getUserChart(username, entries);
          scope.series = ['Comment Points', 'Post Points'];
          scope.colors = ['#37AE9B', '#DCDCDC'];

          scope.data = [
            userChart.getCommentData(),
            userChart.getSubmissionData()
          ];

          scope.voteAverage = userChart.getAverage();
          scope.points = userChart.getPoints();
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

        $document.ready(function() {
          var chart = angular.element('#linechart-' + username);
          var prevElem = element.parent()[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .graph';
          var winHeight = $win.innerHeight();

          var listener = scope.$watch(function() { return angular.element(idName).height() > 0 }, function() {
            var e = angular.element(idName);

            if (!scope.chartReady && e.length > 0 && e[0].clientHeight > 0) {
              var boxTop = chart[0].offsetTop - winHeight + 100;

              $win.on('scroll', function (e) {
                var scrollY = $win.scrollTop();
                if (!scope.chartReady && (scrollY >= boxTop)) {
                  scope.getChart();
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
