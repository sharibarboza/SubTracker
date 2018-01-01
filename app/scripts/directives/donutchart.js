'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('SubSnoopApp')
  .directive('donutChart', ['d3Service', '$window', 'subFactory', '$filter', 'moment', function (d3Service, $window, subFactory, $filter, moment) {

  /*
   Based on http://embed.plnkr.co/YICxe0/
  */
  var windowWidth = $window.innerWidth;

  return {
    restrict: 'EA',
    replace: true,
    template: '<div id="donut-chart"></div>',
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {

        function configChart(scope_chart, window_width) {
          if (window_width < 1200 && window_width > 950) {
            scope_chart = changeChartConfig(window_width);
          } else if (window_width < 550) {
            scope_chart = setChartConfig(330);
          } else {
            scope_chart = setChartConfig(350);
          }
          return scope_chart;
        }

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

        function setChartConfig(chart_width) {

          return {
            width: chart_width,
            height: 350,
            thickness: 30,
            grow: 10,
            labelPadding: 50,
            duration: 100,
            margin: {
              top: 0, right: 70, bottom: 0, left: 70
            }
          };
        }

        function changeChartConfig(window_width) {
          return {
            width: window_width - 750,
            height: 350,
            thickness: 30,
            grow: 10,
            labelPadding: 50,
            duration: 100,
            margin: {
              top: 0, right: 30, bottom: 0, left: 30
            }
          };
        }

        function getPercentages(chartArray, total) {
          for (var i = 0; i < chartArray.length; i++) {
            var percent = chartArray[i].value / total;
            chartArray[i].percent = (percent * 100).toFixed(1);
          }
        }

        function init() {

          // --------------------------------------------------------

          var subs = subFactory.getSubData().subs;
          var chartArray;
          var chartData;

          if (attrs.type === 'activity') {
            chartArray = [];
            chartData = {
              center: {}
            };

            chartData.center.value = "Most Active Subs";

            var sortedSubs = $filter('sortSubs')(Object.keys(subs), 'mostActive', subs);
            var activeArray = sortedSubs.slice(0, 5);
            var total = 0;

            for (var i = 0; i < activeArray.length; i++) {
              var sub = subs[activeArray[i]];
              var posts = sub.comments.length + sub.submissions.length;
              total += posts;

              var d = {};
              d.id = i;
              d.label = activeArray[i];
              d.value = posts;

              chartArray.push(d);
            }
            getPercentages(chartArray, total);
          } else if (attrs.type === 'upvotes') {
            chartArray = [];
            chartData = {
              center: {}
            };

            chartData.center.value = "Most Upvoted Subs";

            var sortedSubs = $filter('sortSubs')(Object.keys(subs), 'totalUps', subs);
            var upvotesArray = sortedSubs.slice(0, 5);
            var total = 0;

            for (var i = 0; i < upvotesArray.length; i++) {
              var sub = subs[upvotesArray[i]];
              var points = sub.comment_ups + sub.submission_ups;
              total += points;

              var d = {};
              d.id = i;
              d.label = upvotesArray[i];
              d.value = points;

              chartArray.push(d);
            }
            getPercentages(chartArray, total);
          }

          chartData.values = chartArray;

          // --------------------------------------------------------

          var d3ChartEl = d3.select(element[0]);
          scope.chartConfig.width = scope.chartConfig.width;
          scope.chartConfig.height = scope.chartConfig.height;
          drawChart(chartData, scope.chartConfig);

          w.bind('resize', function() {
            scope.$apply();
            drawChart(chartData, scope.chartConfig);
          });
        }

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

          var color = d3.scale.ordinal()
            .domain(chartData.values.map(function(item) {
              return item.label;
            }))
            .range(scope.color);

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

          var centerLabel = (!!chartData.center.label) ? chartData.center.label : '';
          var centerValue = (!!chartData.center.value) ? chartData.center.value : '';
          var numData = 'Top 5';

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

          scope.mouseOverPath = function(d) {

            d3.select(this)
              .transition()
              .duration(duration)
              .each("end", function(d) {

                d3.select('.center-value-' + attrs.type).text(d.data.label);
                var line1;
                if (attrs.type === 'activity') {
                  line1 = 'Posts: ' + d.data.value;
                } else if (attrs.type === 'upvotes') {
                  line1 = 'Points: ' + d.data.value;
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

          scope.mouseOutPath = function(d) {
            d3.select(this)
              .transition()
              .attr("d", arc);
          };

          gRoot.on('mouseleave', function(e) {
            if (!e) {
              d3.selectAll('.arc-' + attrs.type).style('opacity', '1');
              d3.select('.center-value-' + attrs.type).text(centerValue);
              d3.select('.line-1-' + attrs.type).text(numData);
              d3.selectAll('.arc-' + attrs.type + ' .legend .percent')
                .transition()
                .duration(duration)
                .style("fill-opacity", 0);
            }
          });

          middleCircle.on('mouseover', function() {
            d3.selectAll('.arc-' + attrs.type).style('opacity', '1');
            d3.select('.center-value-' + attrs.type).text(centerValue);
            d3.select('.line-1-' + attrs.type).text(numData);
            d3.selectAll('.arc-' + attrs.type + ' .legend .percent')
              .transition()
              .duration(duration)
              .style("fill-opacity", 0);
          });

          var arcs = gRoot.selectAll('g.arc')
            .data(pieFn(chartData.values))
            .enter()
            .append('g')
            .attr('class', 'arc-' + attrs.type);

          var partition = arcs.append('svg:path')
            .style('fill', function(d) {  
              return color(d.data.label);
            })
            .on("mouseover", scope.mouseOverPath)
            .on("mouseout", scope.mouseOutPath)
            .each(function() {
              this._current = {
                startAngle: 0,
                endAngle: 0
              };
            })
            .attr('d', arc)
            .transition()
            .duration(1000)
            .attrTween('d', function(d) {
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              };
            });

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
            .text(numData)
            .attr('x', 0)
            .attr('dy', '1em')
            .attr("text-anchor", "middle")
            .attr("class", 'line-1-' + attrs.type)
            .attr("font-size", dataSize)
            .attr("fill", "#333")
            .attr("font-weight", "bold");    

          var legend = arcs.append("svg:text")
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

          legend.append('tspan')
            .attr('class', 'percent')
            .attr('x', 0)
            .attr('font-size', '13px')
            .attr('font-weight', '400')
            .style("fill-opacity", 0)
            .text(function(d, i) {
              return d.data.percent + '%';
            });

          /* If first arc and last arc are same color, change last arc to the 2nd color */
          if (chartData.values.length % scope.color.length === 1) {
            d3.select(partition[0][chartData.values.length-1]).style('fill', scope.color[1]);
          }

        }

        init();

      });

    }
  };
  }]);
