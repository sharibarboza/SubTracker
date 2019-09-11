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

   var subData = subFactory.getSubData().subs[$scope.subreddit];
   subChart.getSubChart($scope.username, $scope.subreddit, subData);
   $scope.series = ['Comment Points', 'Post Points'];

   var data = subChart.getData($scope.subreddit);
   $scope.totalUps = data.totalUps;
   $scope.monthAverage = data.average;

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
           position: 'left',
           ticks: {
             fontColor: "#FFFFFF"
           }
         },
         {
           id: 'y-axis-2',
           type: 'linear',
           display: true,
           position: 'right',
           ticks: {
             fontColor: "#FFFFFF"
           }
         }
       ],
       xAxes: [
         {
           ticks: {
             fontColor: "#FFFFFF"
           }
         }
       ]
     },
     legend: {
         display: true,
         labels:{
             fontSize: 14,
             fontColor: 'white',
         }
     },
   };
}]);
