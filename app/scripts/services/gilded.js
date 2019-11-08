'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.gilded
 * @description
 * # gilded
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('gilded', ['moment', '$filter', function (moment, $filter) {

    /*
     Contains all the categories to sort subreddits and to sort posts
     */

    // Contains cached sorted lists of subreddits
    var gildedPosts = {};
    var defaultSort = 'newest';

    var factory = {
      setData: function(subreddit, posts) {
        if (Object.keys(gildedPosts).length == 20) {
          clear();
        }
        var gilds;
        if (!(subreddit in gildedPosts)) {
          getGildedPosts(posts, subreddit);
        }
      },
      getData: function(subreddit) {
        try {
          return gildedPosts[subreddit];
        } catch(e) {
          return [];
        }
      },
      clearGilded: function() {
        clear();
      },
      hasGilded: function(subreddit) {
        return subreddit in gildedPosts;
      }
    };
    return factory;

    /*
     Get all the gilded posts in the sub.
    */
    function getGildedPosts(posts, subreddit) {
      var gilded = [];

      for (var i = 0; i < posts.length; i++) {
        if ($filter('gilded')(posts[i].gildings) > 0) {
          var node = posts[i];
          gilded.push(node);
        }
      }

      gildedPosts[subreddit] = gilded;
    }

    /*
     Clears gilded posts
    */
    function clear() {
      for (var key in gildedPosts) {
        if (gildedPosts.hasOwnProperty(key)) {
          delete gildedPosts[key];
        }
      }
    }

  }]);
