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
      getAllSubs: function(current_user) {
        if (isEmpty(sub_data) || !subFactory.checkUser(current_user) || current_user != user) {
          user = current_user;
          setData();
          var data = subFactory.getSubData();
          return configureSubs(data);
        }
        return sub_data;
      },
      getBadges: function(current_user) {
        if (isEmpty(sub_badges) || !subFactory.checkUser(current_user) || current_user != user) {
          user = current_user;
          clear(sub_badges);
          clear(sub_data);
          setData();

          var data = subFactory.getSubData();
          sub_badges = initBadges(data);
          sub_data = configureSubs(data);
        }
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
      subs = subFactory.getSubData().subs;
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

    /*
     Get a user's notable subs categorized by subreddit
    */
    function configureSubs(data) {
      if (isEmpty(sub_badges)) {
        initBadges(data);
      }

      for (var key in sub_badges) {
        if ('sub' in sub_badges[key]) {
          var sub = sub_badges[key].sub;
          addSub(sub, sub_badges[key]);
        }
      }

      return sub_data;
    }

    function addSub(sub, data) {
      if (!(sub in sub_data)) {
        sub_data[sub] = {
          'badges': [],
          'image': null
        };
      }

      var point = {'name': data.name, 'icon': data.icon}
      sub_data[sub].badges.push(point);
      sub_data[sub].image = data.image;
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
    function initBadges(data) {
        sub_badges = {
          'mostUpvoted' : {
            'image' : null,
            'name' : 'Most Upvoted',
            'points' : 0,
            'icon' : 'glyphicon glyphicon-arrow-up'
          },
          'mostActive' : {
            'image' : null,
            'name' : 'Most Active',
            'points' : 0,
            'icon' : 'fa fa-heart'
          },
          'topSubmit' : {
            'image' : null,
            'name' : 'Current Best Post',
            'points' : 0,
            'icon' : 'fa fa-file-text'
          },
          'topComment' : {
            'image' : null,
            'name' : 'Current Best Comment',
            'points' : 0,
            'icon' : 'fa fa-comment'
          },
          'mostGilded' : {
            'image' : null,
            'name' : 'Most Gilded',
            'points' : 0,
            'icon' : 'fa fa-star'
          },
          'leastUpvoted' : {
            'image' : null,
            'name' : 'Least Upvoted',
            'points' : 0,
            'icon' : 'glyphicon glyphicon-arrow-down'
          },
          'newestSub' : {
            'image' : null,
            'name' : 'Newest',
            'points' : 0,
            'icon' : 'fa fa-flash'
          },
          'topSub' : {
            'image' : null,
            'name' : 'Top Subreddit of the Week',
            'points' : 0,
            'icon' : 'fa fa-fire'
          },
          'lastSeen' : {
            'image' : null,
            'name' : 'Last Recent Activity',
            'points' : 0,
            'icon' : 'fa fa-clock-o'
          }
        };

        setBadge('mostUpvoted');
        setBadge('mostActive');
        setBadge('leastUpvoted');
        setBadge('newestSub');
        setBadge('lastSeen');

        setBadge('mostGilded');
        var gildedSub = sub_badges['mostGilded'].sub;
        if (!(subs[gildedSub].is_gilded)) {
          delete sub_badges['mostGilded'];
        }
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

        if (sub_badges.hasOwnProperty(category)) {
          sub_badges[category].image = response.icon_img;
        }

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
