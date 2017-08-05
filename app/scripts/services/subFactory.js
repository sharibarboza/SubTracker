'use strict';

/**
 * @ngdoc factory
 * @name tractApp.factory
 * @description
 * # subFactory
 * Factory in the tractApp.
 */
 angular.module('tractApp')
 .factory('subFactory', ['$http', 'userFactory', function ($http, userFactory) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var username;
    var comments = [];
    var submissions = [];
    var subs = {};

    var resetData = function() {
      // Reset all data to empty lists (used for getting a new user)
      comments = [];
      submissions = [];
      subs = {};
    };

    var getPromise = function(after, where) {
      // Make a GET request to the reddit API to fetch comments or submissions
      if (after === 'first') {
        after = '0';
      }

      var url = baseUrl+username+'/'+where+'.json?'+rawJson+'&after='+after+'&limit=100';
      return $http.get(url);
    };

    var getData = function(response, where) {
      // Push the comment/submission data to their respective lists
      if (response) {
        var after = response.data.data.after;
        var data = response.data.data.children;

        for (var i = 0; i < data.length; i++) {
          if (where === 'comments') {
            comments.push(data[i]);
          } else {
            submissions.push(data[i]);
          }
        }

        if (after) {
          return getPromise(after, where);
        }
      }
      return null;
    };

    var setCommentList = function() {
      // Chain promises to fetch all user's comments from reddit API
      var commentPromise = getPromise('first', 'comments');
      var promise = commentPromise
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return getData(response, 'comments'); })
      .then(function(response) { return response; });
      return promise;
    };

    var setSubmitList = function() {
      // Chain promises to fetch all user's submissions from reddit API
      var submitPromise = getPromise('first', 'submitted');
      var promise = submitPromise
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return getData(response, 'submitted'); })
      .then(function(response) { return response; });
      return promise;
    };

    var organizeComments = function(comments) {
      // Organize comments into the subreddits dictionary
      subs = {};
      // Push comments
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i].data;
        var subreddit = comment.subreddit;
        
        if (subreddit in subs) {
          var comment_list = subs[subreddit].comments;
          var date = new Date(comment.created*1000);

          subs[subreddit].comment_ups += parseInt(comment.ups);
          comment_list.push(comment);
          if (date > subs[subreddit].recent_comment) {
            subs[subreddit].recent_comment = date;
          }
        } else {
          subs[subreddit] = {};
          subs[subreddit].comments = new Array(comment);
          subs[subreddit].recent_comment = new Date(comment.created*1000);
          subs[subreddit].comment_ups = parseInt(comment.ups);
          subs[subreddit].submissions = [];
        }
      }
    };

    var organizeSubmitted = function(submissions) {
      // Organize submissions into the subreddits dictionary
      for (var i = 0; i < submissions.length; i++) {
        var submission = submissions[i].data;
        var subreddit = submission.subreddit;

        if (subreddit in subs && subs[subreddit].submissions.length > 0) {
          var submission_list = subs[subreddit].submissions;
          var date = new Date(submission.created*1000);
          var recent_submission = subs[subreddit].recent_submission;

          subs[subreddit].submitted_ups += parseInt(submission.ups);
          submission_list.push(submission);
          if (date > recent_submission) {
            subs[subreddit].recent_submission = date;
          }
        } else {
          if (!(subreddit in subs)) {
            subs[subreddit] = {};
            subs[subreddit].submissions = [];
            subs[subreddit].comments = [];
          }
          subs[subreddit].submissions.push(submission);
          subs[subreddit].recent_submission = new Date(submission.created*1000);
          subs[subreddit].submitted_ups = parseInt(submission.ups);
        }
      }
    };

    return {
      getData: function() {
        // Must be called first before getting comments, submissions, or subs data 

        var userPromise = userFactory.getUser();
        var promise = userPromise
        .then(function(response) {
          username = response.data.data.name;
          resetData();
          return setCommentList();
        }, function(error) {
          console.log('Error fetching comments: ' + error);
        })
        .then(function() {
          return setSubmitList();
        }, function(error) {
          console.log('Error fetching submissions: ' + error);
        })
        .then(function(response) {
          organizeComments(comments);
          organizeSubmitted(submissions);
          return response;
        });

        return promise;
      },
      getCommentList: function() {
        // Returns comments list (getData must be called first to return promise)
        return comments;
      },
      getSubmitList: function() {
        // Returns submissions list (getData must be called first to return promise)
        return submissions;
      },
      getSubs: function() {
        // Returns subreddits dictionary (getData must be called first to return promise)
        return subs;
      }
    };
  }]);
