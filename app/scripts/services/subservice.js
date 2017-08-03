'use strict';

/**
 * @ngdoc service
 * @name tractApp.subService
 * @description
 * # subService
 * Service in the tractApp.
 */
 angular.module('tractApp')
 .service('subService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var subs = {};

    return {
    	organizeComments(comments) {
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
      organizeSubmitted(submissions) {
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
      getSubs() {
        return subs;
      }
    };
});
