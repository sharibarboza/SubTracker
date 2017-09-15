'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('SubSnoopApp')
  .directive('donutChart', ['d3Service', '$window', 'subFactory', 'sortFactory', '$filter', 'moment', function (d3Service, $window, subFactory, sortFactory, $filter, moment) {

  var windowWidth = $window.innerWidth;

  return {
    restrict: 'EA',
    replace: true,
    template: '<div id="donut-chart"></div>',
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {

        var limit = attrs.limit;
        scope.chartConfig = defaultChartConfig();

        if (windowWidth < 550) {
          scope.chartConfig = changeChartConfig();
        }
        
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
          return {
              'w': w.width()
          };
        };

        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
          scope.windowWidth = newValue.w;

          if (newValue.w < 550) {
            scope.chartConfig = changeChartConfig();
          } else {
            scope.chartConfig = defaultChartConfig();
          }

        }, true);

        function defaultChartConfig() {
          return {
            width: 525,
            height: 450,
            thickness: 50,
            grow: 20,
            labelPadding: 50,
            duration: 100,
            margin: {
              top: 0,
              right: 100,
              bottom: 0,
              left: 100
            }
          };
        }

        function changeChartConfig() {
          return {
            width: 350,
            height: 400,
            thickness: 30,
            grow: 10,
            labelPadding: 40,
            duration: 100,
            margin: {
              top: 50,
              right: 60,
              bottom: 50,
              left: 60
            }
          };
        }
          
        function getChartData(data, subs) {
          return {
            center: {
              value: function() {
                if (attrs.type === 'comments') {
                  return "Recent " + limit + " Comments";
                } else if (attrs.type === 'submissions') {
                  return "Recent " + limit + " Posts";
                }
              }
            },
            values: subs,
            data: data
          };
        }

        function getData(data) {
          var subs = {};
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var sub = item.subreddit;
            if (!(item.subreddit in subs)) {
              subs[sub] = {};
              subs[sub].count = 0
            }
            subs[sub].count += 1;
          }
          return subs;
        }

        function init() {
          var dataArray = [];
          var filtered = [];
          var recent = subFactory.getLatest().slice(0, limit);
          var subs, comments, submissions, sortedKeys;

          if (attrs.type === 'comments') {
            comments = subFactory.getRecentPosts('comments', limit);
            subs = getData(comments);
            sortedKeys = $filter('sortSubs')(Object.keys(subs), 'subName', subs);
          } else if (attrs.type === 'submissions') {
            submissions = subFactory.getRecentPosts('submissions', limit);
            subs = getData(submissions);
            sortedKeys = $filter('sortSubs')(Object.keys(subs), 'subName', subs);
          }

          for (var i = 0; i < sortedKeys.length; i++) {
            var key = subs[sortedKeys[i]];
            dataArray.push(key);
          }

          var data = attrs.type === 'comments' ? comments : submissions;
          var chartData = getChartData(data, dataArray);
          for (var i = 0; i < sortedKeys.length; i++) {
            var key = sortedKeys[i];
            var count;
            if (attrs.type === 'comments') {
              count = comments.length;
            } else {
              count = submissions.length;
            }

            var d = subs[key];
            d.id = i;
            d.label = key;

            d.value = +(d.count);
            d.percent = +(d.value / (count));
            d.percent = (d.percent * 100).toFixed(1);
          };

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
          var numData = "Since " + moment(chartData.data[chartData.data.length-1].created_utc * 1000).format('MMM Do YYYY');

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
                if (attrs.type === 'comments') {
                  line1 = 'Comments: ' + d.data.count;
                } else if (attrs.type === 'submissions') {
                  line1 = 'Submissions: ' + d.data.count
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

          var titleSize = '20px';
          var dataSize = '18px';

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
