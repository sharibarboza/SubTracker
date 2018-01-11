'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.rank
 * @description
 * # badges
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('rankings', ['rank', 'subFactory', function (rank, subFactory) {
    
    var subreddit;
    var subs;
    var badges;

    /*
     Get rankings of the specific subreddit relative to the user's
     other subreddits, such as most active rank, most upvoted rank, etc.
    */
    var factory = {
      getStats: function(sub) {
        subreddit = sub;
        var subLength = subFactory.getSubLength();

        badges = {
          'mostActiveRank' : {
            'image' : 'glyphicon glyphicon-stats',
            'rank' : subLength,
            'name' : 'MOST ACTIVE'
          },
          'mostUpsRank' : {
            'image' : 'glyphicon glyphicon-arrow-up',
            'rank' : subLength,
            'name' : 'MOST UPVOTED'
          },
          'mostCommentsRank' : {
            'image' : 'glyphicon glyphicon-comment',
            'rank' : subLength,
            'name' : 'MOST COMMENTS'
          },
          'mostSubmitsRank' : {
            'image' : 'glyphicon glyphicon-list-alt',
            'rank' : subLength,
            'name' : 'MOST SUBMITS'
          }
        };

        subs = subFactory.getSubData().subs;
        rank.setData(subs);

        badges['mostActiveRank'].rank = rank.getSubRank(subreddit, 'mostActive');
        badges['mostUpsRank'].rank = rank.getSubRank(subreddit, 'totalUps');
        badges['mostCommentsRank'].rank = rank.getSubRank(subreddit, 'totalComments');
        badges['mostSubmitsRank'].rank = rank.getSubRank(subreddit, 'totalSubmits');

        return badges;
      }
    };
    return factory;
  }]);
