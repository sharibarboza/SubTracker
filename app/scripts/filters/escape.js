'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:escape
 * @function
 * @description
 * # escape
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('escape', function () {

    return function (input) {
      var string;
      string = input.replace(/&lt;/g, '<');
      string = string.replace(/&gt;/g, '>');
      string = string.replace(/&amp/g, '&');
      string = string.replace(/&;/g, '&');
      string = string.replace(/&;quot;/g, '"');
      string = string.replace(/&;#39;/g, "'");
      string = string.replace(/&;#x2F;/g, '/');
      string = string.replace(/&;#x60;/g, '`');
      string = string.replace(/&;#x3D;/g, '=');
      string = string.replace(/%2F/g, '/');
      string = string.replace(/%3F/g, '?');
      string = string.replace(/%3A/g, ':');
      string = string.replace(/%3D/g, '=');
      return string;
    };
  });
