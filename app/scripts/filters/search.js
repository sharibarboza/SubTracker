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
      newData.status = false;

      for (var key in input.data) {

        // Initalize new object for specific sub
        var subData = {}, commentsLen = 0, submitsLen = 0;
        newData.data[key] = subData;
        subData.comments = [];
        subData.submissions = [];
        subData.status = false;
        subData.numComments = 0;
        subData.numSubmits = 0;

        //If filtered subs array is empty, this means get all subs
        if (subs.length === 0 || subs.indexOf(key) >= 0) {

          // Get the comments only
          if (type !== 3) {
            subData.comments = input.data[key].comments;
            subData.numComments  = subData.comments.length;
          }

          // Get the submissions only
          if (type !== 2) {
            subData.submissions = input.data[key].submissions;
            subData.numSubmits = subData.submissions.length;
          }

          if (subData.numComments || subData.numSubmits) {
            newData.len += (subData.numComments + subData.numSubmits);
            newData.comments += subData.numComments;
            newData.submissions += subData.numSubmits;
            newData.subs += 1;
          }
        }
      }
      return newData;
    };
  });
