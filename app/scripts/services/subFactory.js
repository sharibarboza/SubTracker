'use strict';

/**
 * @ngdoc factory
 * @name tractApp.factory
 * @description
 * # subFactory
 * Factory in the tractApp.
 */
 angular.module('tractApp')
 .factory('subFactory', ['$http', 'userFactory', '$q', 'moment', function ($http, userFactory, $q, moment) {
    var baseUrl = 'http://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var username;
    var promise;
    var comments = [];
    var submissions = [];
    var subs = {};
    var pages = 10;
    var dataAvailable;

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

    var chainPromises = function(where) {
      // Chain promises to fetch all user's comments from reddit API
      var promise = getPromise('first', where);

      for (var i = 0; i < pages; i++) {
        promise = promise.then(function(response) {
          return getData(response, where);
        });
      }
      return promise;
    };

    var buildComment = function(comment) {
      var data = {};
      data.id = comment.id;
      data.subreddit = comment.subreddit;
      data.created_utc = comment.created_utc;
      data.ups = comment.ups;
      data.link_title = comment.link_title;
      data.link_author = comment.link_author;
      data.link_url = comment.link_url;
      data.body_html = comment.body_html;
      data.link_permalink = comment.link_permalink;
      data.gilded = comment.gilded;
      data.num_comments = comment.num_comments;

      return data;
    };

    var buildSubmit = function(submit) {
      var data = {};
      data.id = submit.id;
      data.subreddit = submit.subreddit;
      data.created_utc = submit.created_utc;
      data.url = submit.url;
      data.title = submit.title;
      data.link_flair_text = submit.link_flair_text;
      data.html = submit.html;
      data.ups = submit.ups;
      data.num_comments = submit.num_comments;
      data.selftext_html = submit.selftext_html;
      data.thumbnail = submit.thumbnail;
      data.thumbnail_width = submit.thumbnail_width;
      data.media = submit.media;
      data.preview = submit.preview;
      data.permalink = submit.permalink;
      data.gilded = submit.gilded;

      return data;
    };

    var organizeComments = function(comments) {
      // Organize comments into the subreddits dictionary
      subs = {};
      // Push comments
      for (var i = 0; i < comments.length; i++) {
        var comment = buildComment(comments[i].data);
        var subreddit = comment.subreddit;
        
        if (subreddit in subs) {
          var comment_list = subs[subreddit].comments;
          var date = moment(comment.created_utc*1000);

          subs[subreddit].comment_ups += parseInt(comment.ups);
          subs[subreddit].gilded_comments += parseInt(comment.gilded);

          comment_list.push(comment);
          if (date > subs[subreddit].recent_comment) {
            subs[subreddit].recent_comment = date;
          }
        } else {
          subs[subreddit] = {};
          subs[subreddit].comments = new Array(comment);
          subs[subreddit].recent_comment = moment(comment.created_utc*1000);
          subs[subreddit].comment_ups = parseInt(comment.ups);
          subs[subreddit].submissions = [];
          subs[subreddit].submission_ups = 0;
          subs[subreddit].gilded_comments = 0;
          subs[subreddit].gilded_submits = 0;
        }

        subs[subreddit].total_ups = subs[subreddit].comment_ups;
        subs[subreddit].recent_activity = subs[subreddit].recent_comment;
      }
    };

    var organizeSubmitted = function(submissions) {
      // Organize submissions into the subreddits dictionary
      for (var i = 0; i < submissions.length; i++) {
        var submission = buildSubmit(submissions[i].data);
        var subreddit = submission.subreddit;

        if (subreddit in subs && subs[subreddit].submissions.length > 0) {
          var submission_list = subs[subreddit].submissions;
          var date = moment(submission.created_utc*1000);
          var recent_submission = subs[subreddit].recent_submission;

          subs[subreddit].submission_ups += parseInt(submission.ups);
          subs[subreddit].gilded_submits += parseInt(submission.gilded);

          submission_list.push(submission);
          if (date > recent_submission) {
            subs[subreddit].recent_submission = date;
          }
        } else {
          if (!(subreddit in subs)) {
            subs[subreddit] = {};
            subs[subreddit].submissions = [];
            subs[subreddit].comments = [];
            subs[subreddit].comment_ups = 0;
            subs[subreddit].gilded_comments = 0;
            subs[subreddit].gilded_submits = 0;
          }
          subs[subreddit].submissions.push(submission);
          subs[subreddit].recent_submission = moment(submission.created_utc*1000);
          subs[subreddit].submission_ups = parseInt(submission.ups);
        }

        if ('recent_comment' in subs[subreddit]) {
          if (subs[subreddit].recent_submission > subs[subreddit].recent_comment) {
            subs[subreddit].recent_activity = subs[subreddit].recent_submission;
          }
          subs[subreddit].total_ups += subs[subreddit].submission_ups;
        } else {
          subs[subreddit].recent_activity = subs[subreddit].recent_submission;
          subs[subreddit].total_ups = subs[subreddit].submission_ups;
        }
      }
    };

    var getFirstDate = function() {
      var lastComment, lastSubmit, commentDate, submitDate;

      if (comments.length > 0) {
        lastComment = comments[comments.length-1].data;
        commentDate = moment(lastComment.created_utc*1000);
      }

      if (submissions.length > 0) {
        lastSubmit = submissions[submissions.length-1].data;
        submitDate = moment(lastSubmit.created_utc*1000);
      }

      if (commentDate && submitDate) {
        dataAvailable = (commentDate < submitDate) ? commentDate : submitDate;
      } else if (commentDate) {
        dataAvailable = commentDate;
      } else if (submitDate) {
        dataAvailable = submitDate;
      } 
    };

    return {
      setData: function(user) {
        // Must be called first before getting comments, submissions, or subs data
        username = user;
        resetData();
        var commentPromise = chainPromises('comments');
        var submitPromise = chainPromises('submitted');
        promise = $q.all([commentPromise, submitPromise]);
        promise.then(function() {
          organizeComments(comments);
          organizeSubmitted(submissions);

          getFirstDate();
          sessionStorage.subUser = username;
          var subData = {
            'user': username,
            'comments' : comments.length,
            'submissions' : submissions.length,
            'subs' : subs,
            'firstDate' : dataAvailable
          };
          sessionStorage.subData = JSON.stringify(subData);
        });
      },
      getData: function() {
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
      getDataAvailable: function() {
        return dataAvailable;
      },
      getSubs: function() {
        // Returns subreddits dictionary (getData must be called first to return promise)
        return subs;
      }
    };
  }]);