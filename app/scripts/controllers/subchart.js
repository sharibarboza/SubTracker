'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:SubChartCtrl
 * @description
 * # SubChartCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('SubChartCtrl', ['$scope', 'moment', 'subChart', 'subFactory', function ($scope, moment, subChart, subFactory) {
   var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   $scope.labels = [];

   var today = new Date();
   var d;
   var month;

   for(var i = 6; i >= 0; i -= 1) {
     d = new Date(today.getFullYear(), today.getMonth() - i, 1);
     month = monthNames[d.getMonth()];
     $scope.labels.push(month);
   }

   subChart.getSubChart($scope.username, $scope.subreddit);
   $scope.series = ['Comment Upvotes', 'Submission Upvotes'];

   var data = subChart.getData($scope.subreddit);
   $scope.data = [
     data.commentData,
     data.submissionData
   ];
   $scope.voteAverage = subChart.getAverage($scope.subreddit);
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
