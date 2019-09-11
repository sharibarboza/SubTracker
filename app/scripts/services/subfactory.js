'use strict';

/**
 * @ngdoc factory
 * @name SubSnoopApp.factory
 * @description
 * # subFactory
 * Factory in the SubSnoopApp.
 */
 angular.module('SubSnoopApp')
 .factory('subFactory', ['$http', '$rootScope', 'userFactory', '$q', 'moment', '$filter', 'sortFactory', 'subInfo', 'gilded', 'reaction', 'sentiMood', 'subChart', 'userHeatmap', 'subHeatmap', 'subChart', 'words',
  function ($http, $rootScope, userFactory, $q, moment, $filter, sortFactory, subInfo, gilded, reaction, sentiMood, subChart, userHeatmap, subHeatmap, words,) {
    var pages = 10;
    var username;
    var promise = null;
    var before = moment().utc();
    var done = false;
    var subLength = 0;
    var defaultSortedArray = [];
    var upvotes = 0;
    var total = 0;
    var numComments = 0;
    var numSubmits = 0;

    var comments = [];
    var submissions = [];
    var subs = {};
    var subNames = [];
    var commentData = [];
    var submitData = [];
    var subData = {};

    var latestPost = null;
    var firstPost = null;

    var topComment = [-Infinity, '', null];
    var topSubmit = [-Infinity, '', null];

    var topWeek = {};
    var topSub = null;
    var numSaved = 5;

    var i = 0;

    /*
     User interface for sub factory
    */
    var factory = {
      getData: function(user) {
        resetData();
        username = user.name;
        try {
          promise = getSubPromise(user);
        } catch(e) {
          console.log(e);
        }
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
      getSubNames: function() {
        return subNames;
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
            info.banner_img = "";
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
      var commentPromise = promiseChain('comment', 'commentsCallback');
      var submitPromise = promiseChain('submission', 'submitsCallback');

      // Resolve both comment and submission promises together
      return $q.all([commentPromise, submitPromise]).then(function() {
        var data = setSubData(user);

        return data.then(function(response) {
          subData = response;
          return subData;
        }, function(error) {
          console.log(error);
        });
      }, function(error) {
        console.log(error);
      });
    }

    /*
    Store the last 5 previous users in local storage
    */
    function setPrevUsers(user) {
      //delete localStorage.previous;
      //delete localStorage.prevData;

      if (!('previous' in localStorage)) {
        localStorage.setItem('previous', "");
      }

      if (!('prevData' in localStorage)) {
        localStorage.setItem('prevData', JSON.stringify({}));
      }

      var prevUsers = localStorage.getItem('previous').split(',');
      var prevData = JSON.parse(localStorage.getItem('prevData'));
      var numPrev = 5;

      if (prevUsers.indexOf(user.name) < 0) {
        prevUsers.push(user.name);

        var userData = {};
        userData.avatar = user.icon_img;
        userData.subs = subLength;
        prevData[user.name] = userData;

        if (prevUsers.length > numPrev + 1) {
          delete prevData[prevUsers[0]];
          prevUsers = prevUsers.slice(1, numPrev + 1);
        }
      } else {
        var prevIndex = prevUsers.indexOf(user.name);
        prevUsers.splice(prevIndex, 1);
        prevUsers.push(user.name);
      }

      localStorage.setItem('previous', prevUsers);
      localStorage.setItem('prevData', JSON.stringify(prevData));
    }

    /*
     Configure sub data object, which will be passed to the controllers.
    */
    function setSubData(user_response) {
      var commentPromises = organizePosts(comments, 't1_');
      var submitPromises = organizePosts(submissions, 't3_');
      var promises = commentPromises.concat(submitPromises);

      return $q.all(promises).then(function(response) {
        comments = [];
        submissions = [];
        subs = {};

        var data = [];
        for (var i = 0; i < response.length; i++) {
          data.push.apply(data, response[i].data.data.children);
        }
        var dataLen = data.length;

        for (var i = 0; i < dataLen; i++) {
          var post = data[i].data;

          try {
            var subreddit = post.subreddit;
            if (!(subreddit in subs)) {
              subs[subreddit] = createNewSub();
            }

            if (post.name.indexOf('t1_') >= 0) {
              addComment(subreddit, subs[subreddit], post);
              comments.push(post);
            } else {
              addSubmission(subreddit, subs[subreddit], post);
              submissions.push(post);
            }
            getTopSub(post);
          } catch(e) {
            console.log(e);
          }
        }

        calculateTopSub();
        subNames = Object.keys(subs);
        subLength = subNames.length;

        try {
          setPrevUsers(user_response);
        } catch(error) {
          console.log(error);
        }

        setTotalUps();
        setAverages();
        setDefaultSortedArray();

        subData = {
          'user': createUser(user_response),
          'comments' : comments.length,
          'submissions' : submissions.length,
          'subs' : subs,
          'upvotes' : upvotes,
          'topComment': topComment,
          'topSubmit': topSubmit,
          'topSub': topSub
        }

        return subData;
      }, function(error) {
        console.log(error);
      });
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
      promise = null;
      before = moment().utc();
      done = false;
      subLength = 0;
      defaultSortedArray = [];
      upvotes = 0;
      total = 0;
      numComments = 0;
      numSubmits = 0;

      comments = [];
      submissions = [];
      subs = {};
      subNames = [];
      commentData = [];
      submitData = [];
      subData = {};

      latestPost = null;
      firstPost = null;

      topComment = [-Infinity, '', null];
      topSubmit = [-Infinity, '', null];

      topWeek = {};
      topSub = null;

      i = 0;

      sortFactory.clearSorted();
      gilded.clearGilded();
      reaction.clearData();
      sentiMood.clearData();
      subChart.clearData();
      subHeatmap.clearData();
      userHeatmap.clearData();
      words.clearData();
    }

    /*
     Make the http request to the PushShift API using HTTP GET request.
    */
    function callAPI(where) {
      //var url = 'https://api.reddit.com/user/'+username+'/'+where+'.json?limit=100&after='+after;
      //var call = $http.get(url);
      var url = 'https://api.pushshift.io/reddit/search/'+where+'/?sort=desc&size=500&author='+username+'&before='+before;
      var call = $http.get(url);

      return call;
    }

    /*
     Resolve promise and return data if there is no more requests.
    */
    function getPromise(where, promise) {
      var promise = promise.then(function(response) {
        if (response) {
          var data = response.data.data;
          var data_len = data.length;

          if (data.length > 0) {
            var data = getDataList(where, data, data_len);
          } else {
            before = null;
          }

          if (before) {
            var nextPromise = callAPI(where);
            return getPromise(where, nextPromise);
          } else {
            return null;
          }
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
      return getPromise(where, promise);
    }

    /*
     Update comment or submission array data and return the list
    */
    function getDataList(where, data_list, data_len) {
      if (where === 'comment') {
        commentData.push(data_list);
        pushData('comments', data_list, data_len);
        return commentData;
      } else {
        submitData.push(data_list);
        pushData('submits', data_list, data_len);
        return submitData;
      }
    }

    /*
     Push the comment/submission data to their respective lists
    */
    function pushData(where, data_list, data_len) {
      for (var i = 0; i < data_len; i++) {
        var item = data_list[i];

        if (where === 'comments') {
          if (numComments < 10000) {
            comments.push(item);
            numComments += 1;
          } else {
            console.log(numComments);
            before = null;
            return;
          }
        } else {
          if (numSubmits < 10000) {
            submissions.push(item);
            numSubmits += 1;
          } else {
            before = null;
            return;
          }
        }

        // Set before variable
        if (i == (data_len - 1)) {
          before = item.created_utc;
        }

        total += 1;
        $rootScope.$emit('subCount', total);
      }
    }

    /*
     Grabs the comments and store them in their respective sub object
     as well as other statistics
    */
    function organizePosts(data, prefix) {
      var ids = [];
      var currentID = '';
      var promises = [];
      var dataLen = data.length;

      // Push comments
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        currentID += prefix + item.id + ',';
        if (i == dataLen - 1 ||(i > 0 && i % 99 == 0)) {
          currentID = currentID.replace(/,\s*$/, "");
          ids.push(currentID);
          currentID = '';
        }
      }

      for (var i = 0; i < ids.length; i++) {
        var idURL = 'https://api.reddit.com/api/info.json?id=' + ids[i];
        var promise = $http.get(idURL);
        promises.push(promise);
      }
      return promises;
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
      subData.comment_ups = 0;
      subData.recent_comment = null;
      subData.num_comments = 0;
      subData.submissions = [];
      subData.submission_ups = 0;
      subData.recent_submission = null;
      subData.num_submissions = 0;
      subData.gilds = {};
      subData.gilded_comments = 0;
      subData.gilded_submissions = 0;
      subData.is_gilded = false;
      subData.count = 0;
      subData.recent_activity = null;
      subData.icon = null;
      subData.info = null;
      subData.avg_karma = 0;
      subData.avg_comments = 0;
      subData.avg_submissions = 0;
      subData.top_comment = [-Infinity, null];
      subData.top_submit = [-Infinity, null];

      return subData;
    }

    /*
     Add a new comment to a sub object
    */
    function addComment(name, subreddit, comment) {
      /* Create comment object */
      var obj = {};
      obj.id = comment.id;
      obj.type = 'comment';
      obj.gildings = comment.gildings;
      obj.created_utc = comment.created_utc;
      obj.body_html = comment.body_html;
      obj.link_permalink = comment.permalink.replace(comment.id + '/', '');
      obj.link_title = comment.link_title;
      obj.link_url = comment.link_url;
      obj.link_author = comment.link_author;
      obj.ups = comment.ups;
      obj.subreddit = comment.subreddit;

      subreddit.comments.push(obj);
      subreddit.count += 1;
      subreddit.num_comments += 1;

      var date = $filter('date')(comment);
      subreddit.recent_comment = date;
      subreddit.comment_ups += parseInt(comment.ups);

      subreddit.gilded_comments += $filter('gilded')(comment.gildings);
      getGilded(subreddit, comment.gildings);

      subreddit.recent_activity = compareDates(subreddit.recent_activity, comment, true);

      if (comment.ups > topComment[0]) {
        topComment = [comment.ups, name, obj];
      }
      if (comment.ups > subreddit.top_comment[0]) {
        subreddit.top_comment = [comment.ups, obj];
      }
    }

    /*
     Add a new submission to a sub object
    */
    function addSubmission(name, subreddit, submission) {
      /* Create submission object */
      var obj = {};
      obj.id = submission.id;
      obj.type = 'submission';
      obj.gildings = submission.gildings;
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
      subreddit.num_submissions += 1;

      var date = $filter('date')(submission);
      subreddit.recent_submission = date;
      subreddit.submission_ups += parseInt(submission.ups);
      subreddit.gilded_submissions += $filter('gilded')(submission.gildings);
      getGilded(subreddit, submission.gildings);

      subreddit.recent_activity = compareDates(subreddit.recent_activity, submission, true);

      if (submission.ups > topSubmit[0]) {
        topSubmit = [submission.ups, name, obj];
      }
      if (submission.ups > subreddit.top_submit[0]) {
        subreddit.top_submit = [submission.ups, obj];
      }
    }

    /*
     Get the number of gilds
    */
    function getGilded(subreddit, gildings) {
      for (var key in gildings) {
        if (!(key in subreddit.gilds)) {
          subreddit.gilds[key] = 0;
        }
        subreddit.gilds[key] += gildings[key];

        if (!subreddit.is_gilded && subreddit.gilds[key] > 0) {
          subreddit.is_gilded = true;
        }
      }
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
     Set average comments up and average submission ups for each subreddit
    */
    function setAverages() {
      for (var sub in subs) {
        subs[sub].avg_comments = $filter('average')(subs[sub].comment_ups, subs[sub].num_comments, 0);
        subs[sub].avg_submissions = $filter('average')(subs[sub].submission_ups, subs[sub].num_submissions, 0);
      }
    }

    /*
     Compute the default sorted subreddits alphabetically
     Also, get the length
    */
    function setDefaultSortedArray() {
      defaultSortedArray = $filter('sortSubs')(Object.keys(subs), 'totalUps', subs);
      subLength = defaultSortedArray.length;
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
