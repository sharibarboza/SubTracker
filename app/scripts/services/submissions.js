'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subInfo
 * @description
 * # submissions
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('submissions', function () {

    var username;
    var submits = {};

    /*
     Stores a user's submissions with their HTML content wrappers
     */
    var factory = {
      addContent: function(submission, user) {
        if (username === undefined || username !== user) {
            clear();
            username = user;
        }

        var obj = {};

        obj.selftext_html = submission.selftext_html;
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

        submits[submission.id] = obj;
      },
      isStored: function(submitID, user) {
        if (username === undefined || username !== user) {
            return false;
        } else {
            return (submitID in submits);
        }
      },
      getContent: function(submitID) {
        return submits[submitID];
      },
      clearData: function() {
        clear();
      }
    };
    return factory;

    /*
     Clears data
    */
    function clear() {
      for (var key in submits) {
        if (submits.hasOwnProperty(key)) {
          delete submits[key];
        }
      }
    }
  });
