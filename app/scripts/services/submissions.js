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
      setContent: function(submitID, content, user) {
        if (username === undefined || username !== user) {
            clear();
            username = user;
        }

        if (Object.keys(submits).length == 50) {
          clear();
        }

        submits[submitID] = content;
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
