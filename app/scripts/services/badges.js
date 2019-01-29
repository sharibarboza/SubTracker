'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.rank
 * @description
 * # badges
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('badges', ['$filter', 'subFactory', 'subInfo', 'sortFactory', function ($filter, subFactory, subInfo, sortFactory) {

    var user;
    var subs;
    var keys;
    var badges;
    var table_badges;

    /*
    Used for determining the sub badges such as most active, most upvoted, etc.
    */
    var factory = {
      getSubs: function(current_user) {
        if (badges && user === current_user) {
          return badges;
        } else {
          user = current_user;
          return getBadges();
        }
      },
      getTableBadges: function(current_user) {
          if (!badges || user !== current_user || table_badges == null) {
              table_badges = {};
              for (var key in badges) {
                  table_badges[key] = badges[key];
              }

              getTableBadges();
          }
          return table_badges;
      }
    };
    return factory;

    /*
      Get the subreddit statistics for the users's Stats page
    */
    function getBadges() {
        badges = {
          'mostUpvoted' : {
            'image' : null,
            'name' : 'Most Upvoted Subreddit',
            'points' : 0
          },
          'mostActive' : {
            'image' : null,
            'name' : 'Most Active Subreddit',
            'points' : 0
          },
          'leastUpvoted' : {
            'image' : null,
            'name' : 'Least Upvoted Subreddit',
            'points' : 0
          },
          'newestSub' : {
            'image' : null,
            'name' : 'Newest Subreddit',
            'points' : 0
          }
        };

        subs = subFactory.getSubData().subs;
        keys = subFactory.getDefaultSortedArray();

        setBadge('mostUpvoted');
        setBadge('mostActive');
        setBadge('leastUpvoted');
        setBadge('newestSub');

        return badges;
    };

    /*
     The the subreddit statistics for the badges on the users's subreddits table
    */
    function getTableBadges() {
        table_badges['lastSeen'] = {
            'sub': getSub('lastSeen')
        }
        table_badges['avgPost'] = {
            'sub': getSub('avgPost')
        }
    }

    /*
     Get the subreddit according to the specific category and
     make an API request to get the subreddit's information (banner, description, etc.)
     */
    function setBadge(category) {
      var sub = getSub(category);
      badges[category].sub = sub;

      subInfo.getData(sub).then(function(response) {
        if (response.icon_img !== "" && response.icon_img !== null) {
          badges[category].image = $filter('escape')(response.icon_img);
        } else {
          badges[category].image = null;
        }

        badges[category].points = subs[sub].total_ups;
        subFactory.setSubInfo(sub, response);
      });
    };

    /*
     Use the rank filter to find the specific subreddit based on the category
     */
    function getSub(category) {
      var sub;

      if (category === 'newestSub') {
        sub = subFactory.getNewestSub();
      } else if (category === 'leastUpvoted') {
        sub = $filter('rank')('bottomSub', 'totalUps', subs, keys);
      } else if (category === 'mostUpvoted') {
          sub = $filter('rank')('topSub', 'totalUps', subs, keys);
      } else if (category === 'lastSeen') {
          sub = $filter('rank')('topSub', 'lastSeen', subs, keys);
      } else if (category === 'avgPost') {
          sub = $filter('rank')('topSub', 'avgPost', subs, keys);
      } else {
          sub = $filter('rank')('topSub', category, subs, keys);
      }
      return sub;
    };
  }]);
