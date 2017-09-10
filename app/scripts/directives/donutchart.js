'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:pieChart
 * @description
 * # pieChart
 */
angular.module('SubSnoopApp')
  .directive('donutChart', ['d3Service', '$window', 'subFactory', 'sortFactory', '$filter', function (d3Service, $window, subFactory, sortFactory, $filter) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div id="donut-chart"></div>',
    link: function(scope, element, attrs) {

      var chartConfig = {
        width: 575,
        height: 575,
        thickness: 75,
        grow: 20,
        labelPadding: 55,
        duration: 100,
        margin: {
          top: 0,
          right: 100,
          bottom: 20,
          left: 100
        }
      };

      function getChartData(_data, _subs) {
        return {
          center: {
            value: function() {
            	if (attrs.type === 'activity') {
            		return "Most Active Subs";
            	} else if (attrs.type === 'karma') {
            		return "Best Subs";
            	}
            }
          },
          values: _subs,
          data: _data
        };
      }

      function init() {
      	var dataArray = [];
      	var subData = subFactory.getSubData();
      	var subs = subData.subs;
      	var comments = 0, submissions = 0;
      	var sortedKeys;
      	var subKeys = Object.keys(subs);

      	if (attrs.type === 'activity') {
      		sortedKeys = $filter('sortSubs')(subKeys, 'mostActive', subs);
      	} else if (attrs.type === 'karma') {
      		sortedKeys = $filter('sortSubs')(subKeys, 'totalUps', subs);
      	}

      	var filtered = [];
      	var filteredLength = sortedKeys.length >= 10 ? 10 : sortedKeys.length;
      	for (var i = 0; i < filteredLength; i++) {
      		filtered.push(sortedKeys[i]);
      	}
      	sortedKeys = $filter('sortSubs')(filtered, 'subName', subs);

      	for (var i = 0; i < sortedKeys.length; i++) {
      		var data = subs[sortedKeys[i]];
      		comments += data.comments.length;
      		submissions += data.submissions.length;
      		dataArray.push(data);
      	}

        var chartData = getChartData(subData, dataArray);
        for (var i = 0; i < sortedKeys.length; i++) {
        	var key = sortedKeys[i];
        	var d = subs[key];
        	d.id = i;
          d.label = key;

          if (attrs.type === 'activity') {
          	d.value = +(d.comments.length + d.submissions.length);
          	d.percent = +(d.value / (comments + submissions));
          } else if (attrs.type === 'karma') {
          	d.value = +(d.total_ups);
          	d.percent = +(d.total_ups / (chartData.data.upvotes));
          }

          d.percent = (d.percent * 100).toFixed(1);

        };

        var d3ChartEl = d3.select(element[0]);
        chartConfig.width = parseInt(d3ChartEl.style('width')) || chartConfig.width;
        chartConfig.height = parseInt(d3ChartEl.style('height')) || chartConfig.height;
        drawChart(chartData, chartConfig);
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
	      var numComments = "";
	      var numSubmits = "";



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
	            var line1, line2;
	            if (attrs.type === 'activity') {
	            	line1 = 'Comments: ' + d.data.comments.length;
	            	line2 = 'Submitted: ' + d.data.submissions.length;
	            } else if (attrs.type === 'karma') {
	            	line1 = 'Comment Upvotes: ' + $filter('number')(d.data.comment_ups);
	            	line2 = 'Post Upvotes: ' + $filter('number')(d.data.submission_ups);
	            }

	            d3.select('.line-1-' + attrs.type)
	            	.text(line1);
	            d3.select('.line-2-' + attrs.type)
	            	.text(line2);

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
	        	d3.select('.line-1-' + attrs.type).text(numComments);
	        	d3.select('.line-2-' + attrs.type).text(numSubmits);
            d3.selectAll('.arc-' + attrs.type + ' .legend .percent')
              .transition()
              .duration(duration)
              .style("fill-opacity", 0);
        	}
        });

        middleCircle.on('mouseover', function() {
        	d3.selectAll('.arc-' + attrs.type).style('opacity', '1');
        	d3.select('.center-value-' + attrs.type).text(centerValue);
        	d3.select('.line-1-' + attrs.type).text(numComments);
        	d3.select('.line-2-' + attrs.type).text(numSubmits);
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

        centerText.append('tspan')
          .text(centerValue)
          .attr('x', 0)
          .attr('dy', '0em')
    			.attr("text-anchor", "middle")
          .attr("class", 'center-value-' + attrs.type)
          .attr("font-size", "24px")
          .attr("fill", "#5552B3")
          .attr("font-weight", "bold");

        centerText.append('tspan')
        	.text(numComments)
          .attr('x', 0)
          .attr('dy', '1em')
          .attr("text-anchor", "middle")
          .attr("class", 'line-1-' + attrs.type)
          .attr("font-size", "18px")
          .attr("fill", "#333")
          .attr("font-weight", "bold");    

        centerText.append('tspan')
        	.text(numSubmits)
          .attr('x', 0)
          .attr('dy', '1em')
          .attr("text-anchor", "middle")
          .attr("class", 'line-2-' + attrs.type)
          .attr("font-size", "18px")
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
          .attr('font-size', '16px')
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

    }
  };
  }]);
