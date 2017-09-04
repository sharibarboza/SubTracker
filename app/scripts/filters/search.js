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

    /*
     Used for filtering search results
     param input: the unfiltered data dictionary returned from the search
     param type: 1 (all), 2(comments only), 3(submissions only)
     param: subs: array of subs only to search in
    */
    return function (input, type, subs) {

      /*
       Initalize new object for filitered data
      */
      var newData = {'data': {}};
      newData.len = 0;  // Combined total of filtered comments and submissions
      newData.comments = 0;  // Number of filtered comments
      newData.submissions = 0;  // Number of filtered submissions
      newData.subs = 0;  // Number of subs in filtered data

      for (var key in input.data) {

        // Initalize new object for specific sub
        var subData = {}, commentsLen = 0, submitsLen = 0;
        newData.data[key] = subData;
        subData.comments = [];
        subData.submissions = [];

        //If filtered subs array is empty, this means get all subs
        if (subs.length === 0 || subs.indexOf(key) >= 0) {

          // Get the comments only
          if (type !== 3) {
            subData.comments = input.data[key].comments;
            var commentsLen = subData.comments.length;
          } 

          // Get the submissions only
          if (type !== 2) {
            subData.submissions = input.data[key].submissions;
            var submitsLen = subData.submissions.length;
          }

          if (commentsLen || submitsLen) {
            newData.len += (commentsLen + submitsLen);
            newData.comments += commentsLen;
            newData.submissions += submitsLen;
            newData.subs += 1;
          }
        }
      }
      return newData;
    };
  });
