'use strict';

/* globals d3 */

angular.module('g1b.calendar-heatmap', []).
    directive('calendarHeatmap', ['$window', '$timeout', 'd3Service', '$filter', function ($window, $timeout, d3Service, $filter) {

    return {
      restrict: 'E',
      scope: {
        data: '=',
        color: '=?',
        overview: '=?',
        handler: '=?',
        type: '=?'
      },
      replace: true,
      template: '<div class="calendar-heatmap"></div>',
      link: function (scope, element) {

        d3Service.d3().then(function(d3) {
          // Defaults
          var gutter = 4;
          var item_gutter = 3;
          var width = 600;
          var max_width = 600;
          var height = 600;
          var item_size = 10;
          var label_padding = 20;
          var max_block_height = 20;
          var transition_duration = 500;
          var in_transition = false;

          // Tooltip defaults
          var tooltip_width = 175;
          var tooltip_padding = 10;

          // Initialize current overview type and history
          scope.overview = scope.overview || 'global';
          scope.history = ['global'];
          scope.selected = {};

          // Initialize svg element
          var svg = d3.select(element[0])
            .append('svg')
            .attr('class', 'svg');

          // Initialize main svg elements
          var items = svg.append('g');
          var labels = svg.append('g');
          var buttons = svg.append('g');

          // Add tooltip to the same element as main svg
          var tooltip = d3.select(element[0]).append('div')
            .attr('class', 'parent-tooltip')
            .style('opacity', 0);

          var getNumberOfWeeks = function () {
            var dayIndex = Math.round((moment() - moment().subtract(6, 'month').startOf('week')) / 86400000);
            var colIndex = Math.trunc(dayIndex / 6);
            var numWeeks = colIndex + 1;
            return numWeeks;
          }

          scope.$watch(function () {
            return element[0].clientWidth;
          }, function ( w ) {
            if ( !w ) { return; }
            width = w < max_width ? max_width : w;
            item_size = ((width - label_padding) / getNumberOfWeeks() - gutter);
            height = label_padding + 7 * (item_size + gutter);
            svg.attr({'width': width, 'height': height});
            if ( !!scope.data ) {
              scope.drawChart();
            }
          });

          angular.element($window).bind('resize', function () {
            scope.$apply();
          });

          // Watch for data availability
          scope.$watch('data', function (data) {
            if ( !data ) { return; }

            // Draw the chart
            scope.drawChart();
          });


          /**
           * Draw the chart based on the current overview type
           */
          scope.drawChart = function () {
            if ( !scope.data ) { return; }

            if ( scope.overview === 'global' ) {
              scope.drawGlobalOverview();
            } else if ( scope.overview === 'year' ) {
              scope.drawYearOverview();
            }
          };

          /**
           * Draw year overview
           */
          scope.drawYearOverview = function () {
            // Add current overview to the history
            if ( scope.history[scope.history.length-1] !== scope.overview ) {
              scope.history.push(scope.overview);
            }

            var year_ago = moment().startOf('day').subtract(6, 'month');
            var max_value = d3.max(scope.data, function (d) {
              return d.total;
            });

            // Define start and end date of the selected year
            var start_of_year = moment().startOf('month').subtract(6, 'month');
            var end_of_year = moment().endOf('day');

            // Filter data down to the selected year
            var year_data = scope.data.filter(function (d) {
              return start_of_year <= moment(d.date) && moment(d.date) < end_of_year;
            });

            // Calculate max value of the year data
            var max_value = d3.max(year_data, function (d) {
              return d.total;
            });

            var color = d3.scale.linear()
              .range(['#ABB0B5', scope.color || '#ff4500'])
              .domain([-0.15 * max_value, max_value]);

            var calcItemX = function (d) {
              var date = moment(d.date);
              var dayIndex = Math.round((date - moment(start_of_year).startOf('week')) / 86400000);
              var colIndex = Math.trunc(dayIndex / 7);
              return colIndex * (item_size + gutter) + label_padding;
            };
            var calcItemY = function (d) {
              return label_padding + moment(d.date).weekday() * (item_size + gutter);
            };
            var calcItemSize = function (d) {
              if ( max_value <= 0 ) { return item_size; }
              return item_size * 0.75 + (item_size * d.total / max_value) * 0.25;
            };

            items.selectAll('.item-circle').remove();

            $timeout(function() {
              items.selectAll('.item-circle')
                .data(year_data)
                .enter()
                .append('rect')
                .attr('class', 'item item-circle')
                .style('opacity', 0)
                .attr('x', function (d) {
                  return calcItemX(d) + (item_size - calcItemSize(d)) / 2;
                })
                .attr('y', function (d) {
                  return calcItemY(d) + (item_size - calcItemSize(d)) / 2;
                })
                .attr('rx', function (d) {
                  return calcItemSize(d);
                })
                .attr('ry', function (d) {
                  return calcItemSize(d);
                })
                .attr('width', function (d) {
                  return calcItemSize(d);
                })
                .attr('height', function (d) {
                  return calcItemSize(d);
                })
                .attr('fill', function (d) {
                  return ( d.total > 0 ) ? color(d.total) : 'transparent';
                })
                .on('mouseover', function (d) {
                  if ( in_transition ) { return; }

                  // Pulsating animation
                  var circle = d3.select(this);
                  (function repeat() {
                    circle = circle.transition()
                      .duration(transition_duration)
                      .ease('ease-in')
                      .attr('x', function (d) {
                        return calcItemX(d) - (item_size * 1.1 - item_size) / 2;
                      })
                      .attr('y', function (d) {
                        return calcItemY(d) - (item_size * 1.1 - item_size) / 2;
                      })
                      .attr('width', item_size * 1.1)
                      .attr('height', item_size * 1.1)
                      .transition()
                      .duration(transition_duration)
                      .ease('ease-in')
                      .attr('x', function (d) {
                        return calcItemX(d) + (item_size - calcItemSize(d)) / 2;
                      })
                      .attr('y', function (d) {
                        return calcItemY(d) + (item_size - calcItemSize(d)) / 2;
                      })
                      .attr('width', function (d) {
                        return calcItemSize(d);
                      })
                      .attr('height', function (d) {
                        return calcItemSize(d);
                      })
                      .each('end', repeat);
                  })();

                  // Construct tooltip
                  var tooltip_html = '';
                  tooltip_html += '<div class="heatmap-tooltip">';

                  var entryType = ' entries';

                  tooltip_html += '<div class="header"><strong>' + scope.formatTotal(d.total, entryType) + ' created</strong></div>';

                  tooltip_html += '<div>on ' + moment(d.date).format('dddd, MMM Do YYYY') + '</div><br>';

                  if (scope.type === 'sub') {
                    tooltip_html += '<div><strong>Comments: </strong>' + d.comments + '</div>';
                    tooltip_html += '<div><strong>Posts: </strong>' + d.submissions + '</div>';
                  } else {
                    var sortedSubs = $filter('sortSubs')(Object.keys(d.subs), 'subName', d.subs);

                    for (var i = 0; i < sortedSubs.length; i++) {
                      var key = sortedSubs[i];
                      var sub = d.subs[key];

                      tooltip_html += '<div><strong>' + key + ':</strong> ';
                      if (sub.comments > 0) {
                        tooltip_html += scope.formatTotal(sub.comments, ' comments');
                      }

                      if (sub.comments > 0 && sub.submissions > 0) {
                        tooltip_html += ', ';
                      }

                      if (sub.submissions > 0) {
                        tooltip_html += scope.formatTotal(sub.submissions, ' posts');
                      }

                      tooltip_html += '</div>';
                    }
                  }

                  tooltip_html += '</div>';

                  // Calculate tooltip position
                  var x = calcItemX(d) + item_size;
                  if ( (width*2) - x < (tooltip_width + tooltip_padding * 3) ) {
                    x -= tooltip_width + tooltip_padding * 2;
                  }
                  var y = calcItemY(d) + item_size;
                  y -= 150;

                  // Show tooltip
                  tooltip.html(tooltip_html)
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .transition()
                      .duration(transition_duration / 2)
                      .ease('ease-in')
                      .style('opacity', 1);
                })
                .on('mouseout', function () {
                  if ( in_transition ) { return; }

                  // Set circle radius back to what it's supposed to be
                  d3.select(this).transition()
                    .duration(transition_duration / 2)
                    .ease('ease-in')
                    .attr('x', function (d) {
                      return calcItemX(d) + (item_size - calcItemSize(d)) / 2;
                    })
                    .attr('y', function (d) {
                      return calcItemY(d) + (item_size - calcItemSize(d)) / 2;
                    })
                    .attr('width', function (d) {
                      return calcItemSize(d);
                    })
                    .attr('height', function (d) {
                      return calcItemSize(d);
                    });

                  // Hide tooltip
                  scope.hideTooltip();
                })
                .transition()
                  .delay( function () {
                    return (Math.cos(Math.PI * Math.random()) + 1) * transition_duration;
                  })
                  .duration(function () {
                    return transition_duration;
                  })
                  .ease('ease-in')
                  .style('opacity', 1)
                  .call(function (transition, callback) {
                    if ( transition.empty() ) {
                      callback();
                    }
                    var n = 0;
                    transition
                      .each(function() { ++n; })
                      .each('end', function() {
                        if ( !--n ) {
                          callback.apply(this, arguments);
                        }
                      });
                    }, function() {
                      in_transition = false;
                    });
            }, 500);

            // Add month labels
            var month_labels = d3.time.months(start_of_year, end_of_year);
            var monthScale = d3.scale.linear()
              .range([0, width])
              .domain([0, month_labels.length]);
            labels.selectAll('.label-month').remove();
            labels.selectAll('.label-month')
              .data(month_labels)
              .enter()
              .append('text')
              .attr('class', 'label label-month')
              .attr('font-size', function () {
                return Math.floor(label_padding / 3) + 'px';
              })
              .text(function (d) {
                return d.toLocaleDateString('en-us', {month: 'short'});
              })
              .attr('x', function (d, i) {
                return monthScale(i) + (monthScale(i) - monthScale(i-1)) / 2;
              })
              .attr('y', label_padding / 2)
              .on('mouseenter', function (d) {
                if ( in_transition ) { return; }

                var selected_month = moment(d);
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    return moment(d.date).isSame(selected_month, 'month') ? 1 : 0.1;
                  });
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; }

                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 1);
              });

            // Add day labels
            var day_labels = d3.time.days(moment().startOf('week'), moment().endOf('week'));
            var dayScale = d3.scale.ordinal()
              .rangeRoundBands([label_padding, height])
              .domain(day_labels.map(function (d) {
                return moment(d).weekday();
              }));
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-day')
              .data(day_labels)
              .enter()
              .append('text')
              .attr('class', 'label label-day')
              .attr('x', label_padding / 3)
              .attr('y', function (d, i) {
                return dayScale(i) + dayScale.rangeBand() / 1.75;
              })
              .style('text-anchor', 'left')
              .attr('font-size', function () {
                return Math.floor(label_padding / 3) + 'px';
              })
              .text(function (d) {
                return moment(d).format('dddd')[0];
              })
              .on('mouseenter', function (d) {
                if ( in_transition ) { return; }

                var selected_day = moment(d);
                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', function (d) {
                    return (moment(d.date).day() === selected_day.day()) ? 1 : 0.1;
                  });
              })
              .on('mouseout', function () {
                if ( in_transition ) { return; }

                items.selectAll('.item-circle')
                  .transition()
                  .duration(transition_duration)
                  .ease('ease-in')
                  .style('opacity', 1);
              });
          };


          /**
           * Transition and remove items and labels related to global overview
           */
          scope.removeGlobalOverview = function () {
            items.selectAll('.item-block-year')
              .transition()
              .duration(transition_duration)
              .ease('ease-out')
              .style('opacity', 0)
              .remove();
            labels.selectAll('.label-year').remove();
          },


          /**
           * Transition and remove items and labels related to year overview
           */
          scope.removeYearOverview = function () {
            items.selectAll('.item-circle')
              .transition()
              .duration(transition_duration)
              .ease('ease')
              .style('opacity', 0)
              .remove();
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-month').remove();
            scope.hideBackButton();
          };


          /**
           * Transition and remove items and labels related to month overview
           */
          scope.removeMonthOverview = function () {
            items.selectAll('.item-block-month').selectAll('.item-block-rect')
              .transition()
              .duration(transition_duration)
              .ease('ease-in')
              .style('opacity', 0)
              .attr('x', function (d, i) {
                return ( i % 2 === 0) ? -width/3 : width/3;
              })
              .remove();
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-week').remove();
            scope.hideBackButton();
          };


          /**
           * Transition and remove items and labels related to week overview
           */
          scope.removeWeekOverview = function () {
            items.selectAll('.item-block-week').selectAll('.item-block-rect')
              .transition()
              .duration(transition_duration)
              .ease('ease-in')
              .style('opacity', 0)
              .attr('x', function (d, i) {
                return ( i % 2 === 0) ? -width/3 : width/3;
              })
              .remove();
            labels.selectAll('.label-day').remove();
            labels.selectAll('.label-week').remove();
            scope.hideBackButton();
          };


          /**
           * Transition and remove items and labels related to daily overview
           */
          scope.removeDayOverview = function () {
            items.selectAll('.item-block')
              .transition()
              .duration(transition_duration)
              .ease('ease-in')
              .style('opacity', 0)
              .attr('x', function (d, i) {
                return ( i % 2 === 0) ? -width/3 : width/3;
              })
              .remove();
            labels.selectAll('.label-time').remove();
            labels.selectAll('.label-project').remove();
            scope.hideBackButton();
          };


          /**
           * Helper function to hide the tooltip
           */
          scope.hideTooltip = function () {
            tooltip.transition()
              .duration(transition_duration / 2)
              .ease('ease-in')
              .style('opacity', 0);
          };


          /**
           * Helper function to hide the back button
           */
          scope.hideBackButton = function () {
            buttons.selectAll('.button')
              .transition()
              .duration(transition_duration)
              .ease('ease')
              .style('opacity', 0)
              .remove();
          };


          /**
           * Helper function to convert total to a human readable format
           * @param seconds Integer
           */
          scope.formatTotal = function (value, word) {
            var format;
            var single;

            if (word.trim() == 'entries') {
              single = ' entry';
            } else {
              single = word.slice(0, word.length - 1);
            }

            if (value === 1) {
              format = value + single;
            } else {
              format = value + word;
            }
            return format;
          };
        });
      }
    };
}]);
