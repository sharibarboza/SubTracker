'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:isImage
 * @function
 * @description
 * # isContent
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('isContent', function () {

    /*
     Returns true if url is a format ending in png, jpg, or gif
    */
    function isImage(url) {
      var formats = ['.png', '.jpg', '.gif'];

      if (url) {
        for (var i = 0; i < formats.length; i++) {
          var format = formats[i];
          if (url.indexOf(format) >= 0) {
            return true;
          }
        }
      }

      return false;
    }

    /*
     Checks whether the content of a submission post has valid data
     - Selftext_html/html: For self posts
     - Media: For posts with embedded html, e.g. Youtube videos
     - Preview: For link posts with attached images
     - Spoiler posts can also contain images, therefore also check if the url is an image
    */
    return function (input) {
      return input.selftext_html || input.html || input.media || input.preview || isImage(input.url);
    };
  });
