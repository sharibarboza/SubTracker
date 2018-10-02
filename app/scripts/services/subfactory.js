'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.factory
 * @description
 * # subFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('subFactory', ['$http', '$rootScope', 'userFactory', '$q', 'moment', '$filter', 'sortFactory',
  function ($http, $rootScope, userFactory, $q, moment, $filter, sortFactory) {
    var pages = 10;
    var username;
    var promise;
    var after = "0";
    var subLength = 0;
    var defaultSortedArray = [];
    var upvotes = 0;

    var comments = [];
    var submissions = [];
    var subs = {};
    var subNames;
    var commentData = [];
    var submitData = [];
    var subData = {};

    var latestPost = null;
    var firstPost = null;

    var topComment = [0, ''];
    var topSubmit = [0, ''];

    var i = 0;

    /*
     User interface for sub factory
    */
    var factory = {
      getData: function(user) {
        resetData();
        username = user.name;
        promise = getSubPromise(user);
        return promise;
      },
      getSubData: function() {
        return subData;
      },
      checkUser: function(user) {
        if (username === undefined) {
          return false;
        } else {
          return matchUser(user, username);
        }
      },
      getUser: function() {
        return username;
      },
      getDefaultSortedArray: function() {
        return defaultSortedArray;
      },
      getSubLength: function() {
        return subLength;
      },
      getCommentsList: function() {
        return comments;
      },
      getSubmitsList: function() {
        return submissions;
      },
      setSubInfo: function(subreddit, info) {
        try {
          subData.subs[subreddit].info = info;
        } catch(error) {
          throw subreddit + ' does not exist in ' + username + '\'s subreddits.';
        }
      },
      getFirstPost: function(sub) {
        return firstPost == null ? getFirstPost(sub) : firstPost
      },
      getLatestPost: function(sub) {
        return latestPost == null ? getLatestPost(sub) : latestPost
      },
      getTopComment: function() {
        return topComment;
      },
      getTopSubmit: function() {
        return topSubmit;
      },
      compareDates: compareDates,
      getNewestSub: getNewestSub
    };
    return factory;

    /*
     Check to see if two username strings match
    */
    function matchUser(user1, user2) {
      return user2.toLowerCase() === user1.toLowerCase();
    }

    /*
     Only if user promise resolves, then do promise chaining for comments and
     submissions asynchronously
    */
    function getSubPromise(user) {

      var commentPromise = promiseChain('comments', 'commentsCallback');
      var submitPromise = promiseChain('submitted', 'submitsCallback');
      // Resolve both comment and submission promises together

      return $q.all([commentPromise, submitPromise]).then(function() {
        setSubData(user);
        return subData;
      });
    }

    /*
     Configure sub data object, which will be passed to the controllers.
    */
    function setSubData(response) {
      organizeComments(comments);
      organizeSubmitted(submissions);

      subNames = Object.keys(subs);
      subLength = subNames.length;

      setTotalUps();
      setDefaultSortedArray();

      subData = {
        'user': response,
        'comments' : comments.length,
        'submissions' : submissions.length,
        'subs' : subs,
        'upvotes' : upvotes
      }
    }

    /*
     Reset all data to empty lists (used for getting a new user)
    */
    function resetData() {
      after = "0";
      comments = [];
      submissions = [];
      subs = {};
      commentData = [];
      submitData = [];
      subData = {};
      upvotes = 0;
      latestPost = null;
      firstPost = null;
      topComment = [0, ''];
      topSubmit = [0, ''];
      i = 0;

      sortFactory.clearSorted();
    }

    /*
     Make the http request to the Reddit API using HTTP GET request.
    */
    function callAPI(where) {
      var url = 'https://api.reddit.com/user/'+username+'/'+where+'.json?limit=100&after='+after;
      var call = $http.get(url);
      return call;
    }

    /*
     Resolve promise and return data if there is no more requests.
     If there is still an after value, chain the next promise.
    */
    function getPromise(where, promise) {
      var promise = promise.then(function(response) {
        var data = getDataList(where, response);

        if (after) {
          return callAPI(where);
        } else {
          return data;
        }
      }, function(error) {
        console.log(error);
      });
      return promise;
    }

    /*
     Chain data promises for fetching comments or submissions.
     Reddit API caps at 1000 comments and submisions each. Only 100 items can be
     fetched at a time, making for at most 10 API requests.
    */
    function promiseChain(where) {

      var promise = callAPI(where);

      for (var i = 0; i < pages; i++) {
        promise = getPromise(where, promise);
      }
      return promise;
    }

    /*
     Update comment or submission array data and return the list
    */
    function getDataList(where, response) {
      if (where === 'comments') {
        return getCommentsData(response.data);
      } else {
        return getSubmitsData(response.data);
      }
    }

    /*
     If there is a response, get the new comment post data
     Return current comment data
    */
    function getCommentsData(response) {
      if (response) {
        commentData.push(response.data.children);
        after = response.data.after;
        pushData(response.data, 'comments');
      }
      return commentData;
    }

    /*
     If there is a response, get the new submitted post data
     Return current submissions data
    */
    function getSubmitsData(response) {
      if (response) {
        submitData.push(response.data.children);
        after = response.data.after;
        pushData(response.data, 'submits');
      }
      return submitData;
    }

    /*
     Push the comment/submission data to their respective lists
    */
    function pushData(response, where) {
      if (response) {
        var data = response.children;
        var count = data.length;

        for (var i = 0; i < count; i++) {
          var item = data[i].data;
          if (where === 'comments') {
            item.type = 'comment';
            comments.push(item);
          } else {
            item.type = 'submit';
            submissions.push(item);
          }

          var d = [comments.length + submissions.length, 2000];
          $rootScope.$emit('subCount', d);
        }
      }
    }

    /*
     Grabs the comments and store them in their respective sub object
     as well as other statistics
    */
    function organizeComments(comments) {
      subs = {};

      // Push comments
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        var subreddit = comment.subreddit;

        if (!(subreddit in subs)) {
          subs[subreddit] = createNewSub();
        }
        addComment(subreddit, subs[subreddit], comment);
      }

    }

    /*
     Grabs submissions and stores them in their respective sub object
    */
    function organizeSubmitted(submissions) {
      for (var i = 0; i < submissions.length; i++) {
        var submission = submissions[i];
        var subreddit = submission.subreddit;

        if (!(subreddit in subs)) {
          subs[subreddit] = createNewSub();
        }

        addSubmission(subreddit, subs[subreddit], submission);
      }

      for (var sub in subs) {
        subs[sub].submissions = $filter('sortPosts')(subs[sub].submissions, 'newest');
      }
    }

    /*
     Create and return a new sub object
    */
    function createNewSub() {
      var subData = {};
      subData.comments = [];
      subData.recent_comment = null;
      subData.recent_submission = null;
      subData.comment_ups = 0;
      subData.submissions = [];
      subData.submission_ups = 0;
      subData.gilded_comments = 0;
      subData.gilded_submissions = 0;
      subData.count = 0;
      subData.recent_activity = null;
      subData.info = null;
      subData.avg_karma = 0;

      return subData;
    }

    /*
     Add a new comment to a sub object
    */
    function addComment(name, subreddit, comment) {
      subreddit.comments.push(comment);
      subreddit.count += 1;

      var date = $filter('date')(comment);
      subreddit.recent_comment = date;
      subreddit.comment_ups += parseInt(comment.ups);

      if (subreddit.comment_ups > topComment[0]) {
        topComment = [subreddit.comment_ups, name];
      }

      subreddit.gilded_comments += comment.gilded;
      subreddit.recent_activity = compareDates(subreddit.recent_activity, comment, true);
    }

    /*
     Add a new submission to a sub object
    */
    function addSubmission(name, subreddit, submission) {
      subreddit.submissions.push(submission);
      subreddit.count += 1;

      var date = $filter('date')(submission);
      subreddit.recent_submission = date;
      subreddit.submission_ups += parseInt(submission.ups);

      if (subreddit.submission_ups > topSubmit[0]) {
        topSubmit = [subreddit.submission_ups, name];
      }

      subreddit.gilded_submissions += submission.gilded;
      subreddit.recent_activity = compareDates(subreddit.recent_activity, submission, true);
    }

    /*
     Get the combined total of comment and submission upvotes
    */
    function setTotalUps() {
      for (var sub in subs) {
        subs[sub].total_ups = subs[sub].comment_ups + subs[sub].submission_ups;
        upvotes += subs[sub].total_ups;

        subs[sub].avg_karma = (subs[sub].total_ups / subs[sub].count);
      }
    }

    /*
     Compute the default sorted subreddits alphabetically
     Also, get the length
    */
    function setDefaultSortedArray() {
      defaultSortedArray = $filter('sortSubs')(Object.keys(subs), 'subName', subs);
      subLength = defaultSortedArray.length;
    }

    /*
     Get the oldest post.
     If sub is null, then get the oldest post out of all the user's subs,
     otherwise, get the oldest post in the sub only.
    */
    function getFirstPost(sub) {
      if (sub) {
        if ('first_post' in sub) {
          return sub.first_post;
        }

        var subComment, subSubmit;
        if ('comments' in sub) {
          subComment = sub.comments[sub.comments.length-1];
        }

        if ('submissions' in sub) {
          subSubmit = sub.submissions[sub.submissions.length-1];
        }

        var firstPost = compareDates(subComment, subSubmit, false);
        sub.first_post = firstPost.created_utc;
        return sub.first_post;
      } else {
        var oldestComment = comments[comments.length-1];
        var oldestSubmit = submissions[submissions.length-1];
        var firstPost = compareDates(oldestComment, oldestSubmit, false);
        return firstPost.created_utc;
      }
    }

    /*
     Get the newest post.
     If sub is null, then get the newest post out of all the user's subs,
     otherwise, get the newest post in the sub only.
    */
    function getLatestPost(sub) {
      if (sub) {
        if ('latest_post' in sub) {
          return sub.latest_post;
        }

        var subComment, subSubmit;
        if ('comments' in sub) {
          subComment = sub.comments[0];
        }

        if ('submissions' in sub) {
          subSubmit = sub.submissions[0];
        }

        var latestPost = compareDates(subComment, subSubmit, true);
        sub.latest_post = latestPost.created_utc;
        return sub.latest_post;
      } else {
        var newestComment = comments[0];
        var newestSubmit = submissions[0];
        var newestPost = compareDates(newestComment, newestSubmit, true);
        return newestPost.created_utc;
      }
    }

    /*
     Get the newest active sub by taking the oldest post from each subreddit,
     sort the posts by date and get the newest date. Whichever sub this post
     belongs to is the new sub.
    */
    function getNewestSub() {
      var firstPosts = [];
      var subComments, subSubmits, oldestComment, oldestSubmit;

      for (var key in subs) {
        subComments = subs[key].comments;
        subSubmits = subs[key].submissions;

        oldestComment = subs[key].comments[subComments.length-1];
        oldestSubmit = subs[key].submissions[subSubmits.length-1];

        firstPosts.push(compareDates(oldestComment, oldestSubmit, false));
      }

      return $filter('rank')('topPost', 'newest', firstPosts, null).subreddit;
    }

    /*
     Compare to two dates and return one based on the newest date
     or oldest date.
    */
    function compareDates(post1, post2, newest) {
      var post, date1, date2;

      if (post1) {
        date1 = post1.created_utc * 1000;
      }
      if (post2) {
        date2 = post2.created_utc * 1000;
      }

      if (date1 && date2) {
        if (newest) {
          post = (date1 > date2) ? post1 : post2;
        } else {
          post = (date1 < date2) ? post1 : post2;
        }
      } else {
        post = (date1) ? post1 : post2;
      }

      // Return the post with either the oldest/newest comment
      return post;
    }

  }]);
