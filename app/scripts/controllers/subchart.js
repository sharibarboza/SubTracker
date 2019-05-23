'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubChartCtrl
 * @description
 * # SubChartCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('SubChartCtrl', ['$scope', 'moment', 'subChart', 'subFactory', 'months', function ($scope, moment, subChart, subFactory, months) {
   $scope.labels = months.getLabels();

   subChart.getSubChart($scope.username, $scope.subreddit);
   $scope.series = ['Comment Points', 'Post Points'];

   var data = subChart.getData($scope.subreddit);
   $scope.data = [
     data.commentData,
     data.submissionData
   ];
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
