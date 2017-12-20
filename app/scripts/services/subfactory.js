'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.factory
 * @description
 * # subFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('subFactory', ['$http', 'userFactory', '$q', 'moment', '$sce', '$filter', 'rank', function ($http, userFactory, $q, moment, $sce, $filter, rank) {
    var baseUrl = 'https://www.reddit.com/user/';
    var rawJson = 'raw_json=1';
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
    var commentData = [];
    var submitData = [];
    var subData = {};

    /*
     Callback function to fetch data from user's comments
    */
    window.commentsCallback = function(response) {
      commentData.push(response.data.children);
      after = response.data.after;
      pushData(response.data, 'comments');
    };

    /*
     Callback function to fetch data from user's submissions
    */
    window.submitsCallback = function(response) {
      submitData.push(response.data.children);
      after = response.data.after;
      pushData(response.data, 'submits');
    };

    /*
     User interface for sub factory
    */
    var factory = {
      getData: function(user) {
        resetData();
        username = user;
        var userPromise = userFactory.getData(user);
        return getSubPromise(userPromise);
      },
      getSubData: function() {
        return subData;
      },
      checkUser: function(user) {
        if (!username) {
          return false;
        } else {
          return matchUser(user, username);
        }
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
      compareDates: compareDates,
      getFirstPost: getFirstPost,
      getNewestSub: getNewestSub,
      getLatestPost: getLatestPost,
      getRecentPosts: getRecentPosts
    };
    return factory;

    /*
     Check to see if two username strings match
    */
    function matchUser(user1, user2) {
      return user2.toLowerCase().indexOf(user1.toLowerCase()) >= 0;
    }

    /*
     Configure sub data object, which will be passed to the controllers.
    */
    function setSubData(response) {
      organizeComments(comments);
      organizeSubmitted(submissions);
      setTotalUps();
      setDefaultSortedArray();

      subData = {
        'user': response,
        'comments' : comments.length,
        'submissions' : submissions.length,
        'subs' : subs,
        'latest' : [getLatest('submissions'), getLatest('comment')],
        'upvotes' : upvotes
      }
    };

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
    };

    /*
     Only if user promise resolves, then do promise chaining for comments and
     submissions asynchronously
    */
    function getSubPromise(userPromise) {
      var subPromise = userPromise.then(function(response) {
        if (response && matchUser(response.name, username)) {
          var commentPromise = promiseChain('comments', 'commentsCallback');
          var submitPromise = promiseChain('submitted', 'submitsCallback');

          // Resolve both comment and submission promises together
          var dataPromise = $q.all([commentPromise, submitPromise]).then(function() {
            setSubData(response);
            return subData;
          });
          return dataPromise;
        } else {
          return null;
        }
      }, function(error) {
        return null;
      });
      return subPromise;
    };

    /*
     Make the http request to the Reddit API using JSONP.
    */
    function getJSONP(where, callback) {
      var url = 'https://www.reddit.com/user/'+username+'/'+where+'.json?limit=100&after='+after+'&jsonp='+callback;
      var trustedUrl =  $sce.trustAsResourceUrl(url);
      return $http.jsonp(trustedUrl);
    };

    /*
     Push the comment/submission data to their respective lists
    */
    function pushData(response, where) {
      if (response) {
        var data = response.children;
        for (var i = 0; i < data.length; i++) {
          var item = data[i].data;
          if (where === 'comments') {
            item.type = 'comment';
            comments.push(item);
          } else {
            item.type = 'submit';
            submissions.push(item);
          }
        }
      }
    };

    function getDataList(where) {
      return where === 'comments' ? commentData : submitData;
    };

    /*
     Resolve promise and return data if there is no more requests.
     If there is still an after value, chain the next promise.
    */
    function getPromise(where, callback, promise, index) {
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

    /*
     Chain data promises for fetching comments or submissions.
     Reddit API caps at 1000 comments and submisions each. Only 100 items can be
     fetched at a time, making for at most 10 API requests.
    */
    function promiseChain(where, callback) {
      var promise = getJSONP(where, callback);
      for (var i = 0; i < pages; i++) {
        promise = getPromise(where, callback, promise, i);
      }
      return promise;
    };

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

        addComment(subs[subreddit], comment);
      }
    };

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

        addSubmission(subs[subreddit], submission);
      }
    };

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

      return subData;
    };

    /*
     Add a new comment to a sub object
    */
    function addComment(subreddit, comment) {
      subreddit.comments.push(comment);
      subreddit.count += 1;

      var date = $filter('date')(comment);
      subreddit.recent_comment = date
      subreddit.comment_ups += parseInt(comment.ups);

      if (comment.gilded > 0) {
        subreddit.gilded_comments += 1;
      }

      subreddit.recent_activity = compareDates(subreddit.recent_activity, comment, true);
    };

    /*
     Add a new submission to a sub object
    */
    function addSubmission(subreddit, submission) {
      subreddit.submissions.push(submission);
      subreddit.count += 1;

      var date = $filter('date')(submission);
      subreddit.recent_submission = date
      subreddit.submission_ups += parseInt(submission.ups);

      if (submission.gilded > 0) {
        subs[subreddit].gilded_submissions += 1;
      }

      subreddit.recent_activity = compareDates(subreddit.recent_activity, submission, true);
    }

    /*
     Get the combined total of comment and submission upvotes
    */
    function setTotalUps() {
      for (var sub in subs) {
        subs[sub].total_ups = subs[sub].comment_ups + subs[sub].submission_ups;
        upvotes += subs[sub].total_ups;
      }
    };

    /*
     Compute the default sorted subreddits alphabetically
     Also, get the length
    */
    function setDefaultSortedArray() {
      defaultSortedArray = $filter('sortSubs')(Object.keys(subs), 'subName', subs);
      subLength = defaultSortedArray.length;
    };

    /*
     Get the most recent comment or submission 
    */
    function getLatest(where) {
      if (where === 'comment') {
        return comments[0];
      } else {
        return submissions[0];
      }
    }

    /*
     Get the oldest post.
     If sub is null, then get the oldest post out of all the user's subs,
     otherwise, get the oldest post in the sub only.
    */
    function getFirstPost(sub) {
      if (sub) {
        var subComment, subSubmit;
        if ('comments' in sub) {
          subComment = sub.comments[sub.comments.length-1];
        } 

        if ('submissions' in sub) {
          subSubmit = sub.submissions[sub.submissions.length-1];
        }

        return compareDates(subComment, subSubmit, false);
      } else {
        var oldestComment = comments[comments.length-1];
        var oldestSubmit = submissions[submissions.length-1];
        return compareDates(oldestComment, oldestSubmit, false);
      }
    }

    /*
     Get the newest post.
     If sub is null, then get the newest post out of all the user's subs,
     otherwise, get the newest post in the sub only.
    */
    function getLatestPost(sub) {
      if (sub) {
        var subComment, subSubmit;
        if ('comments' in sub) {
          subComment = sub.comments[0];
        } 

        if ('submissions' in sub) {
          subSubmit = sub.submissions[0];
        }

        return compareDates(subComment, subSubmit, true);
      } else {
        var newestComment = comments[0];
        var newestSubmit = submissions[0];
        return compareDates(newestComment, newestSubmit, true);
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

      return rank.getTopPost(firstPosts, 'newest').subreddit;
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

    /*
     Get either the most recent comments or submissions out of all user's subs.
     A limit can be set to return a specific number of posts.
    */
    function getRecentPosts(where, limit) {
      var posts = [];
      
      if (where === 'comments') {
        posts = comments.slice(0, limit);
      } else {
        posts = submissions.slice(0, limit);
      }

      return posts;
    };

  }]);