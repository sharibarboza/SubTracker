'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.subInfo
 * @description
 * # submissions
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('submissions', ['$http', function ($http) {

    var username;
    var submits = {};

    /*
     Stores a user's submissions with their HTML content wrappers
     */
    return {
      setContent: function(submitID, content, user) {
        if (username === undefined || username !== user) {
            submits = {};
            username = user;
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
      }
    };
  }]);
