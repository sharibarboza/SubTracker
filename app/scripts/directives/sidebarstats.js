'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:sidebarStats
 * @description
 * # sidebarStats
 */
angular.module('SubSnoopApp')
  .directive('sidebarStats', function () {

    /*
     Used for display stats on comments or submissions on the user's sub page.
     It calculates:
      - Oldest comment/submission
      - Total comments/submissions
      - Total gilded comments/submissions
      - Total comment/submission points
      - Average points per comment/submission
    */
    return {
      templateUrl: 'views/side-stats.html',
      restrict: 'E',
      scope: {
        data: '@',
        type: '@'
      },  
      controller: ['$scope', 'rank', 'moment', '$filter', function($scope, rank, moment, $filter) {
        $scope.getOldestDate = function(data) {
          return moment(rank.getTopPost(data, 'oldest').created_utc*1000);
        };

        $scope.getAverage = function(points, total) {
          return $filter('average')(points, total);
        };
      }],
      link: function postLink(scope, element, attrs) {
        scope.data = JSON.parse(attrs.data);
        scope.singleType = attrs.type.slice(0, attrs.type.length-1);
        scope.date = scope.getOldestDate(scope.data[attrs.type]);
        scope.total = scope.data[attrs.type].length;
        scope.points = scope.data[scope.singleType + '_ups'];
        scope.gilded = scope.data['gilded_' + attrs.type];
        scope.average = scope.getAverage(scope.points, scope.total);
        scope.averageType = attrs.type === 'comments' ? 'comment' : 'submit';
      }
    };
  });
