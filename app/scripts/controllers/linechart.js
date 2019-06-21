'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:LineChartCtrl
 * @description
 * # LineChartCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('LineChartCtrl', ['$scope', 'moment', 'userChart', 'subFactory', 'months', function ($scope, moment, userChart, subFactory, months) {
   $scope.labels = months.getLabels();

   var subs = subFactory.getSubData().subs;
   userChart.getUserChart($scope.username, subs);

   $scope.series = ['Comment Points', 'Post Points'];
   $scope.data = [
     userChart.getCommentData(),
     userChart.getSubmissionData()
   ];
   $scope.voteAverage = userChart.getAverage();
   $scope.onClick = function (points, evt) {
     console.log(points, evt);
   };
   $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
   $scope.options = {
     scales: {
       yAxes: [
         {
           id: 'y-axis-1',
           type: 'linear',
           display: true,
           position: 'left'
         },
         {
           id: 'y-axis-2',
           type: 'linear',
           display: true,
           position: 'right'
         }
       ]
     }
   };
}]);
