'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.factory
 * @description
 * # subFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('subFactory', ['$http', '$rootScope', 'userFactory', '$q', 'moment', '$filter', 'sortFactory', 'subInfo',
  function ($http, $rootScope, userFactory, $q, moment, $filter, sortFactory, subInfo) {
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

    var topWeek = {};
    var topSub = null;

    var i = 0;

    /*
     User interface for sub factory
    */
    var factory = {
      getData: function(user, refresh) {
        resetData();
        username = user.name;
        promise = getSubPromise(user, refresh);
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
          if (info.banner_img == "" || info.banner_img == null) {
            info.banner_img = '../images/icons-bg.jpg';
          }
          subData.subs[subreddit].info = info;
        } catch(error) {
          throw subreddit + ' does not exist in ' + username + '\'s subreddits.';
        }
      },
      setIcons: function(subreddit, iconImg) {
        try {
          if (iconImg !== "" && iconImg !== null) {
            subData.subs[subreddit].icon = iconImg;
          } else {
            subData.subs[subreddit].icon = null;
          }
        } catch(error) {
          throw subreddit + ' does not have an icon image.';
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
    function getSubPromise(user, refresh) {
      if (refresh == null) {
        refresh = false;
      }

      //delete localStorage.previous;
      //delete localStorage.prevData;

      if (refresh || localStorage.getItem('user') != user.name) {
        var commentPromise = promiseChain('comments', 'commentsCallback');
        var submitPromise = promiseChain('submitted', 'submitsCallback');
        // Resolve both comment and submission promises together

        return $q.all([commentPromise, submitPromise]).then(function() {
          setSubData(user);

          try {
            //localStorage.clear();
            localStorage.setItem('user', user.name);
            localStorage.setItem('data', JSON.stringify(subData));
          } catch(e) {
            console.log(e);
          }

          try {
            // Store in previous searched users
            if (!('previous' in localStorage)) {
              localStorage.setItem('previous', "");
            }

            if (!('prevData' in localStorage)) {
              localStorage.setItem('prevData', JSON.stringify({}));
            }

            var prevUsers = localStorage.getItem('previous').split(',');
            var prevData = JSON.parse(localStorage.getItem('prevData'));

            if (prevUsers.indexOf(user.name) < 0) {
              prevUsers.push(user.name);

              var userData = {};
              userData.avatar = user.icon_img;
              userData.subs = subLength;
              prevData[user.name] = userData;

              if (prevUsers.length > 6) {
                delete prevData[prevUsers[0]];
                prevUsers = prevUsers.slice(1, 7);
              }
            } else {
              var prevIndex = prevUsers.indexOf(user.name);
              prevUsers.splice(prevIndex, 1);
              prevUsers.push(user.name);
            }

            localStorage.setItem('previous', prevUsers);
            localStorage.setItem('prevData', JSON.stringify(prevData));
          } catch(error) {
            console.log(error);
          }

          return subData;
        });
      } else {
        subData = JSON.parse(localStorage.getItem('data'));
        subs = subData.subs;
        subNames = Object.keys(subs);
        subLength = subNames.length;
        setDefaultSortedArray();
        return subData;
      }
    }

    /*
     Configure sub data object, which will be passed to the controllers.
    */
    function setSubData(response) {
      organizeComments(comments);
      organizeSubmitted(submissions);
      calculateTopSub();

      subNames = Object.keys(subs);
      subLength = subNames.length;

      setTotalUps();
      setDefaultSortedArray();

      subData = {
        'user': createUser(response),
        'comments' : comments.length,
        'submissions' : submissions.length,
        'subs' : subs,
        'upvotes' : upvotes,
        'topComment': topComment[1],
        'topSubmit': topSubmit[1],
        'topSub': topSub
      }
    }

    /*
     Caclulate the top sub of the week
    */
    function calculateTopSub() {
      var max = null;
      for (var sub in topWeek) {
        if (max == null || topWeek[sub] > max) {
          topSub = sub;
          max = topWeek[sub];
        }
      }
    }

    /*
     Create user object
    */
    function createUser(response) {
      var obj = {};
      obj.created_utc = response.created_utc;
      obj.icon_img = response.icon_img;
      obj.name = response.name;

      obj.subreddit = null;
      if (response.subreddit) {
        obj.subreddit = {};
        obj.subreddit.icon_img = response.subreddit.icon_img;
      }
      obj.comment_karma = response.comment_karma;
      obj.link_karma = response.link_karma;

      return obj;
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
      topWeek = {};
      topSub = null;
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
        getTopSub(comment);
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
        getTopSub(submission);
      }

      for (var sub in subs) {
        subs[sub].submissions = $filter('sortPosts')(subs[sub].submissions, 'newest');
      }
    }

    /*
     Calculate the top post in the past week
    */
    function getTopSub(post) {
      var date = moment.utc(post.created_utc * 1000).format();
      var diff = moment.duration(moment().diff(moment(date))).asDays();

      if (diff <= 7) {
        if (!(post.subreddit in topWeek)) {
          topWeek[post.subreddit] = 0;
        }

        topWeek[post.subreddit] += post.ups;
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
      subData.icon = null;
      subData.info = null;
      subData.avg_karma = 0;

      return subData;
    }

    /*
     Add a new comment to a sub object
    */
    function addComment(name, subreddit, comment) {
      /* Create comment object */
      var obj = {};
      obj.id = comment.id;
      obj.type = comment.type;
      obj.gilded = comment.gilded;
      obj.created_utc = comment.created_utc;
      obj.body_html = comment.body_html;
      obj.link_permalink = comment.link_permalink;
      obj.link_title = comment.link_title;
      obj.link_url = comment.link_url;
      obj.link_author = comment.link_author;
      obj.num_comments = comment.num_comments;
      obj.ups = comment.ups;
      obj.subreddit = comment.subreddit;

      subreddit.comments.push(obj);
      subreddit.count += 1;

      var date = $filter('date')(comment);
      subreddit.recent_comment = date;
      subreddit.comment_ups += parseInt(comment.ups);

      if (comment.ups > topComment[0]) {
        topComment = [comment.ups, name];
      }

      subreddit.gilded_comments += comment.gilded;
      subreddit.recent_activity = compareDates(subreddit.recent_activity, comment, true);
    }

    /*
     Add a new submission to a sub object
    */
    function addSubmission(name, subreddit, submission) {
      /* Create submission object */
      var obj = {};
      obj.id = submission.id;
      obj.type = submission.type;
      obj.gilded = submission.gilded;
      obj.created_utc = submission.created_utc;
      obj.num_comments = submission.num_comments;
      obj.permalink = submission.permalink;
      obj.ups = submission.ups;
      obj.selftext_html = submission.selftext_html;
      obj.subreddit = submission.subreddit;
      obj.title = submission.title;
      obj.url = submission.url;
      obj.thumbnail = submission.thumbnail;
      obj.thumbnail_width = submission.thumbnail_width;
      obj.link_flair_text = submission.link_flair_text;

      obj.media = null;
      if (submission.media) {
        obj.media = {};
        if ('oembed' in submission.media) {
          obj.media.oembed = submission.media.oembed;
        }
        if ('reddit_video' in submission.media) {
          obj.media.reddit_video = submission.media.reddit_video;
        }
      }

      obj.preview = null;
      if (submission.preview) {
        obj.preview = {};
        if ('images' in submission.preview) {
          obj.preview = submission.preview.images[0].resolutions;
        }
      }

      subreddit.submissions.push(obj);
      subreddit.count += 1;

      var date = $filter('date')(submission);
      subreddit.recent_submission = date;
      subreddit.submission_ups += parseInt(submission.ups);

      if (submission.ups > topSubmit[0]) {
        topSubmit = [submission.ups, name];
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
