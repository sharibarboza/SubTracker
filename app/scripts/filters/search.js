'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:search
 * @function
 * @description
 * # search
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('search', function () {
    return function (input, type, subs) {
      var newData = {'data': {}};
      newData.len = 0;
      newData.comments = 0;
      newData.submissions = 0;
      newData.subs = 0;

      for (var key in input.data) {
        var subData = {}, commentsLen = 0, submitsLen = 0;
        newData.data[key] = subData;
        subData.comments = [];
        subData.submissions = [];

        if (subs.length === 0 || subs.indexOf(key) >= 0) {
          if (type !== 3) {
            subData.comments = input.data[key].comments;
            var commentsLen = subData.comments.length;
          } 
          if (type !== 2) {
            subData.submissions = input.data[key].submissions;
            var submitsLen = subData.submissions.length;
          }

          if (commentsLen || submitsLen) {
            newData.len += commentsLen;
            newData.len += submitsLen;
            newData.comments += commentsLen;
            newData.submissions += submitsLen;
            newData.subs += 1;
          }
        }
      }
      return newData;
    };
  });
