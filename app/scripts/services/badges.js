'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.rank
 * @description
 * # badges
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('badges', ['$filter', 'rank', 'subFactory', 'subInfo', 'sortFactory', function ($filter, rank, subFactory, subInfo, sortFactory) {
    
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
        if (badges && user == current_user) {
          return badges;
        } else {
          user = current_user;
          return getBadges();
        }
      },
      getTableBadges: function(current_user) {
          if (!badges || user != current_user || table_badges == null) {
              table_badges = {};
              for (var key in badges) {
                  table_badges[key] = badges[key];
              }

              getTableBadges();
          }

          setBadge('mostUpvoted');
          return table_badges;
      }
    };
    return factory;

    function getBadges() {
        badges = {
          'mostUpvoted' : {
            'image' : null,
            'name' : 'MOST UPVOTED SUB',
            'points' : 0 
          },
          'mostActive' : {
            'image' : null,
            'name' : 'MOST ACTIVE SUB',
            'points' : 0 
          },
          'leastUpvoted' : {
            'image' : null,
            'name' : 'LEAST UPVOTED SUB',
            'points' : 0 
          },
          'newestSub' : {
            'image' :null,
            'name' : 'NEWEST SUB',
            'points' : 0 
          }
        };
        subs = subFactory.getSubData().subs;
        keys = subFactory.getDefaultSortedArray();

        setBadge('mostUpvoted');
        setBadge('mostActive');
        setBadge('leastUpvoted');
        setBadge('newestSub');

        // Reset filters to current sort value
        rank.getTopSub(keys, sortFactory.getSubSort().value, subs);

        return badges;
    };

    function getTableBadges() {
        table_badges['lastSeen'] = {
            'sub': getSub('lastSeen')
        }
    }

    function setBadge(category) {
      var sub = getSub(category);
      badges[category].sub = sub;

      subInfo.getData(sub).then(function(response) {
        badges[category].image = $filter('escape')(response.icon_img);
        badges[category].points = subs[sub].total_ups;
        subFactory.setSubInfo(sub, response);
      });
    };

    function getSub(category) {
      var sub;

      if (category === 'newestSub') {
        sub = subFactory.getNewestSub();
      } else if (category === 'leastUpvoted') {
        sub = rank.getBottomSub(keys, 'totalUps', subs);
      } else if (category === 'mostUpvoted') {
          sub = rank.getTopSub(keys, 'totalUps', subs);
      } else if (category === 'lastSeen') {
          sub = rank.getTopSub(keys, 'lastSeen', subs);
      } else {
        sub = rank.getTopSub(keys, 'mostActive', subs);
      }

      return sub;
    }; 
  }]);
