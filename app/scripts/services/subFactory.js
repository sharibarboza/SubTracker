'use strict';

/**
 * @ngdoc service
 * @name tractApp.subService
 * @description
 * # subService
 * Service in the tractApp.
 */
 angular.module('tractApp')
 .factory('subFactory', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var username;
    var comments = [];
    var submissions = [];
    var subs = {};

    var resetData = function() {
      comments = [];
      submissions = [];
      subs = {};
    };

    var getCommentPromise = function(username, after) {
      var url = baseUrl+username+'/comments.json?'+rawJson+'&after='+after+'&limit=100';
      return $http.get(url);
    };

    var getSubmitPromise = function(username, after) {
      var url = baseUrl+username+'/submitted.json?'+rawJson+'&after='+after+'&limit=100';
      return $http.get(url);
    };

    var getComments = function(username, after) {
      if (after === 'first') {
        return getCommentPromise(username, 0);
      } else {
        return getCommentPromise(username, after);
      }
    };

    var getSubmitted = function(username, after) {
      if (after === 'first') {
        return getSubmitPromise(username, 0);
      } else {
        return getSubmitPromise(username, after);
      }
    };

    var getData = function(response, where) {
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
          if (where === 'comments') {
            return getComments(username, after);
          } else {
            return getSubmitted(username, after);
          }

        }
      }
      return null;
    };

    return {
      setUser: function(user) {
        username = user;
        resetData();
      },
      setCommentList: function() {
        var commentPromise = getComments(username, 'first');
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
      },
      setSubmitList: function() {
        var submitPromise = getSubmitted(username, 'first');
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
      },
      getCommentList: function() {
        return comments;
      },
      getSubmitList: function() {
        return submissions;
      },
      organizeComments: function(comments) {
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
      },
      organizeSubmitted: function(submissions) {
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
      },
      getSubs: function() {
        return subs;
      }
    };
  }]);
