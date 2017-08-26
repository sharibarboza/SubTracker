'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:sanitize
 * @function
 * @description
 * # sanitize
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('sanitize', ['$sanitize', '$filter', function ($sanitize, $filter) {

		var entityMap = {
		  '&': '&amp;',
		  '<': '&lt;',
		  '>': '&gt;',
		  '"': '&quot;',
		  "'": '&#39;',
		  '/': '&#x2F;',
		  '`': '&#x60;',
		  '=': '&#x3D;'
		}; 

		var escapeHtml = function(string) {
			string = string.replace(/&lt;/g, '<');
			string = string.replace(/&gt;/g, '>');
			string = string.replace(/&amp/g, '&');
			string = string.replace(/&;quot;/g, '"');
			string = string.replace(/&;#39;/g, "'");
			string = string.replace(/&;#x2F;/g, '/');
			string = string.replace(/&;#x60;/g, '`');
			string = string.replace(/&;#x3D;/g, '=');
			return string;
		};

    return function (input) {

      input = $filter('redditlink')(input);
      return $sanitize(escapeHtml(input));
    };
  }]);
