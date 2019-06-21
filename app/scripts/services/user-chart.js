'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.userChart
 * @description
 * # userChart
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('userChart', ['moment', function (moment) {

    var user;
    var subs;
    var commentData = [0, 0, 0, 0, 0, 0, 0];
    var submissionData = [0, 0, 0, 0, 0, 0, 0];
    var points = 0;
    var numMonths = 6;

    var minDate = moment().startOf('day').subtract(numMonths, 'month');
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var months = [];
    var diff = (moment.duration(moment().diff(minDate)).asMonths()).toFixed(0);

    /*
     Sets up the data for the user line chart graph.
    */
    return {
      getUserChart: function(current_user, subData) {
        if (user !== current_user) {
          user = current_user;
          subs = subData;
          resetData();
          getPosts();
        }
      },
      getCommentData: function() {
        return commentData;
      },
      getSubmissionData: function() {
        return submissionData;
      },
      getAverage: function() {
        return (points / diff).toFixed(0);
      }
    };

    function resetData() {
      commentData = [0, 0, 0, 0, 0, 0, 0];
      submissionData = [0, 0, 0, 0, 0, 0, 0];
      points = 0;
      months = [];
      setMonths();
    }

    function setMonths() {
      var today = new Date();
      var d;

      for(var i = numMonths; i >= 0; i -= 1) {
        d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        var month = monthNames[d.getMonth()];
        months.push(month);
      }
    }

    function getPosts() {
      for (var key in subs) {
        getComments(subs[key].comments);
        getSubmissions(subs[key].submissions);
      }
    }

    function getComments(comments) {
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        try {
          var date = moment(comment.created_utc * 1000);
          if (date >= minDate) {
            var monthName = monthNames[date.month()];
            var index = months.indexOf(monthName);
            commentData[index] += comment.ups;
            points += comment.ups;
          }
        } catch(e) {
          console.log(e);
        }
      }
    }

    function getSubmissions(submissions) {
      for (var i = 0; i < submissions.length; i++) {
        var submission = submissions[i];
        try {
          var date = moment(submission.created_utc * 1000);
          if (date >= minDate) {
            var monthName = monthNames[date.month()];
            var index = months.indexOf(monthName);
            submissionData[index] += submission.ups;
            points += submission.ups;
          }
        } catch(e) {
          console.log(e);
        }
      }
    }

  }]);
