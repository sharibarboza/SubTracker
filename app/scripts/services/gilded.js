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

    var factory = {
      setData: function(subreddit, posts) {
        var gilds = getGildedPosts(posts);
        gildedPosts[subreddit] = gilds;
      },
      getData: function(subreddit) {
        try {
          return gildedPosts[subreddit];
        } catch(e) {
          return [];
        }
      },
      clearGilded: function() {
        gildedPosts = {};
      },
      hasGilded: function(subreddit) {
        return subreddit in gildedPosts;
      }
    };
    return factory;

    /*
     Get all the gilded posts in the sub.
    */
    function getGildedPosts(posts) {
      var gilded = [];

      for (var i = 0; i < posts.length; i++) {
        if ($filter('gilded')(posts[i].gildings) > 0) {
          gilded.push(posts[i]);
        }
      }
      return gilded;
    }


  }]);
