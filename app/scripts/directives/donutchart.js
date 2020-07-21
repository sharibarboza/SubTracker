'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('SubSnoopApp')
  .directive('donutChart', ['d3Service', '$window', '$document', 'subFactory', '$filter', 'moment', 'sentiMood', 'reaction',
    function (d3Service, $window, $document, subFactory, $filter, moment, sentiMood, reaction) {

  /*
   Based on http://embed.plnkr.co/YICxe0/
  */
  var windowWidth = $window.innerWidth;
  var $win = angular.element($window);

  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    link: function(scope, element, attrs) {
      scope.chartReady = false;
      scope.loaderImg = '../images/103.gif';
      var subname = scope.subreddit;

      d3Service.d3().then(function(d3) {

        /*
         Set dimensions for pie charts
         */
        var height;
        if (attrs.type === 'sentiment' || attrs.type === 'reaction') {
          height = 375;
        } else {
          height = 475;
        }

        function configChart(scope_chart, window_width) {
          if (window_width < 700) {
            scope_chart = setChartConfig(300);
          } else {
            scope_chart = setChartConfig(260);
          }
          return scope_chart;
        }

        /*
         Default configuration for pie chart
         */
        function setChartConfig(chart_width) {

          return {
            width: chart_width,
            height: height,
            thickness: 30,
            grow: 10,
            labelPadding: 35,
            duration: 0,
            margin: {
              top: 50, right: 50, bottom: -50, left: 50
            }
          };
        };

        function init() {

          // --------------------------------------------------------

          /*
           Get data to populate pie charts
           */
          var user;
          var chartData;
          var d3ChartEl;

          // --------------------------------------------------------

          scope.getChart = function() {
            d3ChartEl = d3.select(element[0]);
            user = subFactory.getUser();

            if (subname && attrs.type === 'sentiment') {
              sentiMood.setSubData(subname, subFactory.getEntries(subname, null), user);
              chartData = sentiMood.getData(subname);
            } else if (subname && attrs.type === 'reaction') {
              reaction.setSubData(subname, subFactory.getEntries(subname, null), user);
              chartData = reaction.getData(subname);
            }

            scope.chartReady = true;
            scope.chartConfig = configChart(scope.chartConfig, windowWidth);

            var w = angular.element($window);
            scope.getWindowDimensions = function () {
              return {
                  'w': w.width()
              };
            };

            try {
              drawChart(chartData, scope.chartConfig);

              w.bind('resize', function() {
                scope.$apply();
                drawChart(chartData, scope.chartConfig);
              });
            } catch(error) {
              console.log(error);
            }
          }

        }

        /*
         Draw the pie chart with center text and mouse over events
         */
        function drawChart(chartData, chartConfig) {
          var width = chartConfig.width,
            height = chartConfig.height,
            margin = chartConfig.margin,
            grow = chartConfig.grow,
            labelRadius,
            radius,
            duration = chartConfig.duration;

            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom,
            radius = Math.min(width, height) / 2,
            labelRadius = radius + chartConfig.labelPadding;

          var thickness = chartConfig.thickness || Math.floor(radius / 5);

          var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - thickness);

          var arcOver = d3.svg.arc()
            .outerRadius(radius + grow)
            .innerRadius(radius - thickness);

          var pieFn = d3.layout.pie()
            .sort(null)
            .value(function(d) {
              return d.value;
            });

          var centerValue = (!!chartData.center.value) ? chartData.center.value : '';
          var centerValue2 = (!!chartData.center.value2) ? chartData.center.value2 : '';

          var d3ChartEl = d3.select(element[0]);
          d3ChartEl.select('svg').remove();

          var gRoot = d3ChartEl.append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g');

          gRoot.attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + (height / 2 + margin.top) + ')');

          var middleCircle = gRoot.append('svg:circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', radius)
            .style('fill', '#1F2327');

          /*
           Display percentage and center text statistics when hovering over an arc
           */
          scope.mouseOverPath = function(d) {
            d3.select(this)
              .transition()
              .duration(duration)
              .each("end", function(d) {

                d3.select('.center-value-' + attrs.type).text(d.data.label);
                var line1;
                if (attrs.type === 'upvotes') {
                  line1 = 'Points: ' + $filter('number')(d.data.value);
                } else {
                  line1 = 'Entries: ' + $filter('number')(d.data.value);
                }

                d3.select('.line-1-' + attrs.type)
                  .text(line1);

                d3.selectAll('.arc-' + attrs.type + ' .legend .percent')
                  .transition()
                  .duration(duration)
                  .style('fill-opacity', 0);
                d3.select(this.parentNode).select('.legend .percent')
                  .transition()
                  .duration(duration)
                  .style("fill-opacity", 1);

                d3.selectAll('.arc-' + attrs.type).style('opacity', function(e) {
                  return e.data.label === d.data.label ? '1' : '0.3';
                });

              })
              .attr("d", arcOver);
          };

          /*
           Shrink the arc back to original width of pie chart ring
           */
          scope.reduceArc = function(d) {
            try {
              if (d) {
                d3.select(this)
                  .transition()
                  .attr("d", arc);
              } else {
                d3.selectAll('.arc-' + attrs.type + ' path')
                .each(function() {
                  d3.select(this)
                    .transition()
                    .attr("d", arc);
                });
              }
            } catch(error) {
              console.log("Error: " + error);
            }
          }

          /*
           The state of the chart when the mouse is not hovered over it
           */
          scope.restoreCircle = function() {
            d3.selectAll('.arc-' + attrs.type).style('opacity', '1');
            d3.select('.center-value-' + attrs.type).text(centerValue);
            d3.select('.line-1-' + attrs.type).text(centerValue2);
            d3.selectAll('.arc-' + attrs.type + ' .legend .percent')
              .transition()
              .duration(duration)
              .style("fill-opacity", 0);

            scope.reduceArc();
          };

          gRoot.on('mouseleave', function(e) {
            if (!e) {
              scope.restoreCircle();
            }
          });

          middleCircle.on('mouseover', function() {
            scope.restoreCircle();
          });

          var arcs = gRoot.selectAll('g.arc')
            .data(pieFn(chartData.values))
            .enter()
            .append('g')
            .attr('class', 'arc-' + attrs.type);

          var partition = arcs.append('svg:path')
            .style('fill', function(d) {
              return chartData.colors[d.data.label];
            })
            .on("mouseover", scope.mouseOverPath)
            .each(function() {
              this._current = {
                startAngle: 0,
                endAngle: 0
              };
            })
            .on("mouseleave", scope.reduceArc)
            .attr('d', arc)
            .transition()
            .duration(duration)
            .attrTween('d', function(d) {
              try {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  return arc(interpolate(t));
                };
              } catch(error) {
                console.log(e);
              }
            });

          /*
           Set up center text for pie chart with name of chart and number of posts
           */
          var centerText = gRoot.append('svg:text')
            .attr('class', 'center-label');

          var titleSize = '14px';
          var dataSize = '14px';

          centerText.append('tspan')
            .text(centerValue)
            .attr('x', 0)
            .attr('dy', '0em')
            .attr("text-anchor", "middle")
            .attr("class", 'center-value-' + attrs.type)
            .attr("font-size", titleSize)
            .attr("fill", "#fff")
            .attr("font-weight", "bold");

          centerText.append('tspan')
            .text(centerValue2)
            .attr('x', 0)
            .attr('dy', '1em')
            .attr("text-anchor", "middle")
            .attr("class", 'line-1-' + attrs.type)
            .attr("font-size", dataSize)
            .attr("fill", "#9099A1")
            .attr("font-weight", "400");

          var percents = arcs.append("svg:text")
            .style('fill-opacity', 0)
            .attr('class', 'legend')
            .attr("transform", function(d) {
              var c = arc.centroid(d),
                x = c[0],
                y = c[1],
                height = Math.sqrt(x * x + y * y);
                return "translate(" + ((x-13) / height * labelRadius) + ',' +
                ((y+5) / height * labelRadius) + ")";
            });

          percents.append('tspan')
            .attr('class', 'percent')
            .attr('x', 0)
            .attr('font-size', '13px')
            .attr('font-weight', '400')
            .attr('fill', '#fff')
            .style("fill-opacity", 0)
            .text(function(d, i) {
              return d.data.percent + '%';
            });

          var legend = gRoot.append('g')
            .attr('class', 'legend')
            .selectAll('text')
            .data(chartData.values)
              .enter();

          /*
           Displays legend indicating what color represents what category
           */
          legend.append('rect')
            .attr('height', 10)
            .attr('width', 10)
            .attr('x', function(d) {
              if (attrs.type === 'sentiment' || attrs.type === 'reaction') {
                return 0 - radius - 35;
              } else {
                return 0 - radius - 20;
              }
            })
            .attr('y', function(d, i) {
              if (attrs.type === 'sentiment' || attrs.type === 'reaction') {
                return (20 * (i + 1) - 210);
              } else {
                return (20 * (i + 1)) - 260;
              }
            })
            .on('mouseover', function(d, i) {
              var sel = d3.selectAll('.arc-' + attrs.type).filter(function(d) {
                return d.data.id === i;
              });
              scope.mouseOverPath.call(sel.select('path')[0][0], sel.datum());
            })
            .style('fill', function(d) {
              return chartData.colors[d.label];
            });

          legend.append('text')
            .attr('x', function(d) {
              if (attrs.type === 'sentiment' || attrs.type === 'reaction') {
                return 0 - radius - 15;
              } else {
                return 0 - radius;
              }
            })
            .attr('y', function(d, i) {
              if (attrs.type === 'sentiment' || attrs.type === 'reaction') {
                return (20 * (i + 1) - 200);
              } else {
                return (20 * (i + 1)) - 250;
              }
            })
            .attr('font-size', '12px')
            .attr('fill', '#9099A1')
            .on('mouseover', function(d, i) {
              var sel = d3.selectAll('.arc-' + attrs.type).filter(function(d) {
                return d.data.id === i;
              });
              scope.mouseOverPath.call(sel.select('path')[0][0], sel.datum());
            })
            .text(function(d) { return d.label; });

        }

        init();

        $document.ready(function() {
          var chart = angular.element('#piecharts-' + subname);
          var donutElem = element.parent().parent().parent();
          var prevElem = donutElem[0].previousElementSibling;
          var idName = '#' + prevElem.id + ' .graph';

          // If no activity in the last year, there will be no charts, get top entries instead
          if (prevElem.id.length == 0) {
            var prevElem = prevElem.previousElementSibling;
            if (angular.element('#top-post-' + subname).length > 0) {
              idName = '#' + prevElem.id + ' .post-content';
            } else {
              idName = '#' + prevElem.id + ' .post-body';
            }
          }
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

      });

    }
  };
  }]);
