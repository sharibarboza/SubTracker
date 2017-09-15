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

  	function isImage(url) {
  		var formats = ['.png', '.jpg', '.gif'];
  		for (var i = 0; i < formats.length; i++) {
  			var format = formats[i];
  			if (url.indexOf(format) >= 0) {
  				return true;
  			}
  		}
  		return false;
  	}

    return function (input) {
    	return input.selftext_html || input.html || input.media || input.preview || isImage(input.url);
    };
  });
