'use strict';

/**
 * @ngdoc function
 * @name SubSnoopApp.controller:LineChartCtrl
 * @description
 * # LineChartCtrl
 * Controller of the SubSnoopApp
 */
 angular.module('SubSnoopApp')
 .controller('LineChartCtrl', ['$scope', 'moment', 'userChart', 'subFactory', function ($scope, moment, userChart, subFactory) {
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

   userChart.getUserChart($scope.username);

   $scope.series = ['Comment Upvotes', 'Submission Upvotes'];
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
