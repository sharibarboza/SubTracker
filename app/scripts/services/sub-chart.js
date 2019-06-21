'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subChart
 * @description
 * # subChart
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('subChart', ['moment', function (moment) {

    var user;
    var subs = {};
    var numMonths = 6;

    var minDate = moment().startOf('day').subtract(numMonths, 'month');
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var months = [];
    var diff = (moment.duration(moment().diff(minDate)).asMonths()).toFixed(0);

    /*
     Sets up the data for the subreddit line chart graph.
    */
    return {
      getSubChart: function(current_user, sub, data) {
        if (user !== current_user) {
          user = current_user;
          resetData();
        }

        if (Object.keys(subs).length == 20) {
          clear();
        }

        if (!(sub in subs)) {
          subs[sub] = {};
          subs[sub].commentData = [0, 0, 0, 0, 0, 0, 0];
          subs[sub].submissionData = [0, 0, 0, 0, 0, 0, 0];
          subs[sub].totalUps = 0;
          getComments(data.comments, sub);
          getSubmissions(data.submissions, sub);
        }
      },
      getSubs: function() {
        return subs;
      },
      getData: function(sub) {
        return subs[sub];
      },
      clearData: function() {
        clear();
      }
    };

    function resetData() {
      months = [];
      setMonths();
      clear();
    }

    /*
     Clears data
    */
    function clear() {
      for (var key in subs) {
        if (subs.hasOwnProperty(key)) {
          delete subs[key];
        }
      }
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

    function getComments(comments, sub) {
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        try {
          var date = moment(comment.created_utc * 1000);
          if (date >= minDate) {
            var monthName = monthNames[date.month()];
            var index = months.indexOf(monthName);
            subs[sub].commentData[index] += comment.ups;
            subs[sub].totalUps += comment.ups;
          }
        } catch(e) {
          console.log(e);
        }
      }
    }

    function getSubmissions(submissions, sub) {
      for (var i = 0; i < submissions.length; i++) {
        var submission = submissions[i];
        try {
          var date = moment(submission.created_utc * 1000);
          if (date >= minDate) {
            var monthName = monthNames[date.month()];
            var index = months.indexOf(monthName);
            subs[sub].submissionData[index] += submission.ups;
            subs[sub].totalUps += submission.ups;
          }
        } catch(e) {
          console.log(e);
        }
      }
    }

  }]);
