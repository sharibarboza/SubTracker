'use strict';

/**
 * @ngdoc directive
 * @name tractApp.directive:sidebarStats
 * @description
 * # sidebarStats
 */
angular.module('tractApp')
  .directive('sidebarStats', function () {
    return {
      templateUrl: 'views/side-stats.html',
      restrict: 'E',
      scope: {
        data: '@',
        type: '@'
      },  
      controller: ['$scope', 'rank', 'moment', function($scope, rank, moment) {
        $scope.getOldestDate = function(data) {
          return moment(rank.getTopPost(data, 'oldest').created_utc*1000);
        };

        $scope.getAverage = function(points, total) {
          if (total === 0) {
            return 0;
          } else {
            var average = (points/total).toFixed(0);
            return average !== '-0' ? average : 0;
          }
        };
      }],
      link: function postLink(scope, element, attrs) {
        scope.data = JSON.parse(attrs.data);
        scope.singleType = attrs.type.slice(0, attrs.type.length-1);
        scope.date = scope.getOldestDate(scope.data[attrs.type]);
        scope.total = scope.data[attrs.type].length;
        scope.points = scope.data[scope.singleType + '_ups'];
        scope.gilded = scope.data['gilded_' + attrs.type];
        console.log(scope.data);
        scope.average = scope.getAverage(scope.points, scope.total);
        scope.averageType = attrs.type === 'comments' ? 'comment' : 'submit';
      }
    };
  });
