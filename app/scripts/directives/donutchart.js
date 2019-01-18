'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('SubSnoopApp')
  .directive('donutChart', ['d3Service', '$window', 'subFactory', '$filter', 'moment', 'sentiMood', 'reaction',
    function (d3Service, $window, subFactory, $filter, moment, sentiMood, reaction) {

  /*
   Based on http://embed.plnkr.co/YICxe0/
  */
  var windowWidth = $window.innerWidth;

  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    template: '<div id="donut-chart"></div>',
    link: function(scope, element, attrs) {
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
          if (window_width < 1200 && window_width > 950) {
            scope_chart = changeChartConfig(window_width);
          } else if (window_width < 400) {
            scope_chart = setChartConfig(250);
          } else if (window_width < 700) {
            scope_chart = setChartConfig(300);
          } else {
            scope_chart = setChartConfig(310);
          }
          return scope_chart;
        }

        /*
         Adjust chart width according to the user's width of the screen
         */
        scope.chartConfig = configChart(scope.chartConfig, windowWidth);

        var w = angular.element($window);
        scope.getWindowDimensions = function () {
          return {
              'w': w.width()
          };
        };

        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
          scope.windowWidth = newValue.w;
          scope.chartConfig = configChart(scope.chartConfig, newValue.w);
        }, true);

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
            duration: 100,
            margin: {
              top: 50, right: 70, bottom: -50, left: 70
            }
          };
        };

        /*
         Configuration for smaller screens
         */
        function changeChartConfig(window_width) {
          return {
            width: window_width - 750,
            height: height,
            thickness: 30,
            grow: 10,
            labelPadding: 35,
            duration: 100,
            margin: {
              top: 50, right: 30, bottom: -50, left: 30
            }
          };
        };

        function init() {

          // --------------------------------------------------------

          /*
           Get data to populate pie charts
           */
          var user = subFactory.getUser();
          var chartData;
          if (attrs.sub && attrs.type === 'sentiment') {
            chartData = sentiMood.getData(attrs.sub);
          } else if (attrs.sub && attrs.type === 'reaction') {
            chartData = reaction.getData(attrs.sub);
          }

          // --------------------------------------------------------

          var d3ChartEl = d3.select(element[0]);
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
            .style('fill', '#fff');

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
            .duration(1000)
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
            .attr("fill", "#696969")
            .attr("font-weight", "bold");

          centerText.append('tspan')
            .text(centerValue2)
            .attr('x', 0)
            .attr('dy', '1em')
            .attr("text-anchor", "middle")
            .attr("class", 'line-1-' + attrs.type)
            .attr("font-size", dataSize)
            .attr("fill", "#333")
            .attr("font-weight", "bold");

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
            .attr('fill', '#333')
            .on('mouseover', function(d, i) {
              var sel = d3.selectAll('.arc-' + attrs.type).filter(function(d) {
                return d.data.id === i;
              });
              scope.mouseOverPath.call(sel.select('path')[0][0], sel.datum());
            })
            .text(function(d) { return d.label; });

        }

        init();

      });

    }
  };
  }]);
