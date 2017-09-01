'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.factory
 * @description
 * # subFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('subFactory', ['$http', 'userFactory', '$q', 'moment', '$sce', function ($http, userFactory, $q, moment, $sce) {
    var baseUrl = 'https://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
    var username;
    var promise;
    var comments = [];
    var submissions = [];
    var subs = {};
    var pages = 10;
    var dataAvailable;

    var commentData = [];
    var submitData = [];
    var after = "0";

    var subsData = {};

    var resetData = function() {
      // Reset all data to empty lists (used for getting a new user)
      comments = [];
      submissions = [];
      subs = {};
      commentData = [];
      submitData = [];
      after = '0';
    };

    var buildComment = function(comment) {
      var data = {};

      data.type = 'comment';
      data.id = comment.id;
      data.subreddit = comment.subreddit;
      data.created_utc = comment.created_utc;
      data.ups = comment.ups;
      data.link_title = comment.link_title;
      data.link_author = comment.link_author;
      data.link_url = comment.link_url;
      data.body = comment.body;
      data.body_html = comment.body_html;
      data.link_permalink = comment.link_permalink;
      data.gilded = comment.gilded;
      data.num_comments = comment.num_comments;

      return data;
    };

    var buildSubmit = function(submit) {
      var data = {};

      data.type = 'submit';
      data.id = submit.id;
      data.subreddit = submit.subreddit;
      data.created_utc = submit.created_utc;
      data.url = submit.url;
      data.title = submit.title;
      data.link_flair_text = submit.link_flair_text;
      data.html = submit.html;
      data.ups = submit.ups;
      data.num_comments = submit.num_comments;
      data.selftext = submit.selftext;
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
        var comment = comments[i];
        var subreddit = comment.subreddit;
        var ups = parseInt(comment.ups);
        
        if (subreddit in subs) {
          var comment_list = subs[subreddit].comments;
          var date = moment(comment.created_utc*1000);

          subs[subreddit].comment_ups += ups;

          comment_list.push(comment);
          if (date > subs[subreddit].recent_comment) {
            subs[subreddit].recent_comment = date;
          }
        } else {
          subs[subreddit] = {};
          subs[subreddit].comments = new Array(comment);
          subs[subreddit].recent_comment = moment(comment.created_utc*1000);
          subs[subreddit].comment_ups = ups;
          subs[subreddit].submissions = [];
          subs[subreddit].submission_ups = 0;
          subs[subreddit].gilded_comments = 0;
          subs[subreddit].gilded_submissions = 0;
        }

        if (comment.gilded > 0) {
          subs[subreddit].gilded_comments += 1;
        }

        subs[subreddit].recent_activity = subs[subreddit].recent_comment;
      }
    };

    var organizeSubmitted = function(submissions) {
      // Organize submissions into the subreddits dictionary
      for (var i = 0; i < submissions.length; i++) {
        var submission = submissions[i];
        var subreddit = submission.subreddit;
        var ups = parseInt(submission.ups);

        if (subreddit in subs && subs[subreddit].submissions.length > 0) {
          var submission_list = subs[subreddit].submissions;
          var date = moment(submission.created_utc*1000);
          var recent_submission = subs[subreddit].recent_submission;

          subs[subreddit].submission_ups += ups;

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
            subs[subreddit].gilded_submissions = 0;
          } 
          subs[subreddit].submissions.push(submission);
          subs[subreddit].recent_submission = moment(submission.created_utc*1000);
          subs[subreddit].submission_ups = ups;
        }

        if (submission.gilded > 0) {
          subs[subreddit].gilded_submissions += 1;
        }

        if ('recent_comment' in subs[subreddit]) {
          if (subs[subreddit].recent_submission > subs[subreddit].recent_comment) {
            subs[subreddit].recent_activity = subs[subreddit].recent_submission;
          }
        } else {
          subs[subreddit].recent_activity = subs[subreddit].recent_submission;
        }
      }
    };

    var setTotalUps = function() {
      for (var sub in subs) {
        subs[sub].total_ups = subs[sub].comment_ups + subs[sub].submission_ups;
      }
    };

    var getFirstDate = function() {
      var lastComment, lastSubmit, commentDate, submitDate;

      if (comments.length > 0) {
        lastComment = comments[comments.length-1];
        commentDate = moment(lastComment.created_utc*1000);
      }

      if (submissions.length > 0) {
        lastSubmit = submissions[submissions.length-1];
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

    var getLatest = function() {
      var latest = [];
      var comment_index = 0;
      var submit_index = 0;
      var comment, submit, comment_date, submit_date;

      while (latest.length < 2 && comment_index <= comments.length && submit_index <= submissions.length) {
        if (comments.length > comment_index) {
          comment = comments[comment_index];
          comment_date = moment(comment.created_utc*1000);
        } else {
          comment = null;
        }

        if (submissions.length > submit_index) {
          submit = submissions[submit_index];
          submit_date = moment(submit.created_utc*1000);
        } else {
          submit = null;
        }

        if (comment && submit) {
          if (comment_date > submit_date) {
            latest.push(comment);
            comment_index += 1;
          } else {
            latest.push(submit);
            submit_index += 1;
          }
        } else if (comment && !submit) {
          latest.push(comment);
          comment_index += 1;
        } else if (!comment && submit) {
          latest.push(submit);
          submit_index += 1;
        } else {
          break;
        }
      }

      return latest;
    };

    window.commentsCallback = function(response) {
      commentData.push(response.data.children);
      after = response.data.after;
      pushData(response.data, 'comments');
    }

    window.submitsCallback = function(response) {
      submitData.push(response.data.children);
      after = response.data.after;
      pushData(response.data, 'submits');
    }

    var pushData = function(response, where) {
      // Push the comment/submission data to their respective lists
      if (response) {
        var after = response.after;
        var data = response.children;
        for (var i = 0; i < data.length; i++) {
          if (where === 'comments') {
            var comment = buildComment(data[i].data);
            comments.push(comment);
          } else {
            var submission = buildSubmit(data[i].data);
            submissions.push(submission);
          }
        }
      }
    };

    var getDataList = function(where) {
      return where === 'comments' ? commentData : submitData;
    }

    var getPromise = function(where, callback, promise, index) {
      var promise = promise.then(function() {
        return getDataList(where);
      }, function() {
        if (index === pages-1) {
          return getDataList(where);
        } else {
          return after ? getJSONP(where, callback) : getDataList(where);
        }
      });
      return promise;
    };

    var promiseChain = function(where, callback) {
      var promise = getJSONP(where, callback);
      for (var i = 0; i < pages; i++) {
        promise = getPromise(where, callback, promise, i);
      }
      return promise;
    };

    var getJSONP = function(where, callback) {
      var url = 'https://www.reddit.com/user/'+username+'/'+where+'.json?limit=100&after='+after+'&jsonp='+callback;
      var trustedUrl =  $sce.trustAsResourceUrl(url);
      return $http.jsonp(trustedUrl);
    }

    var getSubData = function(response) {
      organizeComments(comments);
      organizeSubmitted(submissions);
      setTotalUps();

      getFirstDate();
      var subData = {
        'user': response,
        'comments' : comments.length,
        'submissions' : submissions.length,
        'subs' : subs,
        'firstDate' : dataAvailable,
        'latest' : getLatest()
      }
      cacheData(subData, response);
      return subData;
    };

    var cacheData = function(data) {
      sessionStorage.user = data.name;
      sessionStorage.subData = JSON.stringify(data);
    };

    return {
      getData: function(user) {
        username = user;
        resetData();

        var userPromise = userFactory.getData(user);
        var testPromise = userPromise.then(function(response) {

          if (response !== "") {
            var commentPromise = promiseChain('comments', 'commentsCallback');
            var submitPromise = promiseChain('submitted', 'submitsCallback');

            var dataPromise = $q.all([commentPromise, submitPromise]).then(function() {
              return getSubData(response);
            });
            return dataPromise;
          } else {
            return "";
          }
        });
        return testPromise;
      },
      setSubs: function(data) {
        subsData = data;
      },
      getSubs: function() {
        return subsData;
      },
      getDefaultSort: function() {
        return {value: 'subName', name: 'Subreddit name'};
      }
    };
  }]);