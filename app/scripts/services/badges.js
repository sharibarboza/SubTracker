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

    var user = null;
    var subs;
    var keys;
    var sub_badges = {};
    var sub_data = {};

    /*
    Used for determining the sub badges such as most active, most upvoted, etc.
    */
    var factory = {
      getSubs: function(current_user) {
        if (isEmpty(sub_data) || !subFactory.checkUser(current_user) || current_user != user) {
          user = current_user;
          clear(sub_badges);
          clear(sub_data);
          setData();

          sub_badges = initBadges();
          configureSubs();
        }
        return sub_data;
      },
      getBadges: function() {
        return sub_badges;
      },
      clearData: function() {
        clear(sub_badges);
        clear(sub_data);
      }
    };
    return factory;

    /*
     Sets sub data from sub factory
    */
    function setData() {
      subs = subFactory.getAllSubs();
      keys = subFactory.getDefaultSortedArray();
    }

    /*
     Clears data
    */
    function clear(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          delete data[key];
        }
      }
    }

    function configureSubs() {
      for (var badge in sub_badges) {
        var data = sub_badges[badge];
        var sub = data.sub;
        if (!(sub in sub_data)) {
          sub_data[sub] = [];
        }

        var b = {
          'name': data.name, 'icon': data.icon
        }
        sub_data[sub].push(b);
      }
    }

    /*
     Check if object is empty
    */
    function isEmpty(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }

    /*
      Get the subreddit statistics for the users's Stats page
    */
    function initBadges() {
        sub_badges = {
          'mostUpvoted' : {
            'image' : null,
            'name' : 'Most Upvoted',
            'icon' : 'glyphicon glyphicon-arrow-up'
          },
          'mostActive' : {
            'image' : null,
            'name' : 'Most Active',
            'icon' : 'fa fa-heart'
          },
          'topSubmit' : {
            'image' : null,
            'name' : 'Current Best Post',
            'icon' : 'fa fa-file-text'
          },
          'topComment' : {
            'image' : null,
            'name' : 'Current Best Comment',
            'icon' : 'fa fa-comment'
          },
          'mostGilded' : {
            'image' : null,
            'name' : 'Most Gilded',
            'icon' : 'fa fa-star'
          },
          'newestSub' : {
            'image' : null,
            'name' : 'Newest',
            'icon' : 'fa fa-flash'
          },
          'topSub' : {
            'image' : null,
            'name' : 'Top Subreddit of the Week',
            'icon' : 'fa fa-fire'
          },
          'lastSeen' : {
            'image' : null,
            'name' : 'Last Recent Activity',
            'icon' : 'fa fa-clock-o'
          }
        };

        setBadge('mostUpvoted');
        setBadge('mostActive');
        setBadge('newestSub');
        setBadge('lastSeen');

        setBadge('mostGilded');
        var gildedSub = sub_badges['mostGilded'].sub;
        if (!(subs[gildedSub].is_gilded)) {
          delete sub_badges['mostGilded'];
        }

        var data = subFactory.getSubData();
        var tops = ['topSubmit', 'topComment', 'topSub'];

        for (var i = 0; i < tops.length; i++) {
          var category = tops[i];
          var sub = data[category];
          if (category == 'topSubmit' || category == 'topComment') {
            sub = sub[1];
          }

          if (sub) {
            setBadge(category, sub);
          } else {
            delete sub_badges[category];
          }
        }

        return sub_badges;
    };

    /*
     Get the subreddit according to the specific category and
     make an API request to get the subreddit's information (banner, description, etc.)
     */
    function setBadge(category, sub) {
      if (!sub) {
        sub = getSub(category);
      }
      sub_badges[category].sub = sub;

      subInfo.getData(sub).then(function(response) {
        var name = response.display_name;
        subFactory.setIcons(name, response.icon_img);
        subFactory.setSubInfo(name, response);
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
      } else if (category === 'mostGilded') {
        sub = $filter('rank')('topSub', 'mostGilded', subs, keys);
      } else {
        sub = $filter('rank')('topSub', category, subs, keys);
      }
      return sub;
    };
  }]);
