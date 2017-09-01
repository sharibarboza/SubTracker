'use strict';

/**
 * @ngdoc filter
 * @name SubSnoopApp.filter:highlight
 * @function
 * @description
 * # highlight
 * Filter in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .filter('highlight', ['$sce', '$filter', function ($sce, $filter) {

    var checkStartTag = function(p2, p3) {
      var j = p2, char;
      while (j >= 0) {
        char = p3[j];
        if (char === '>') {
          return false;
        } else if (char === '<') {
          return true;
        }

        j -= 1;
      }
      return false;
    };

    var checkEndTag = function(p2, p3) {
      var j = p2 + 1, char;
      while (j < p3.length) {
        char = p3[j];
        if (char === '<') {
          return false;
        } else if (char === '>') {
          return true;
        }

        j += 1;
      }
      return false;
    };

    var isHtmlTag = function(p2, p3) {
      return checkStartTag(p2, p3) && checkEndTag(p2, p3);
    };

    var replacer = function(match, p1, p2, p3) {
      var isTag = isHtmlTag(p2, p3);

      if (!isTag && match && match.length > 0) {
        return '<span class="highlight">' + match + '</span>';
      } else {
        return match;
      }

    };

    return function (input, term) {
      input = $filter('escape')(input);
      if (term && input && term.length > 0) {
        input = input.replace(new RegExp('('+term+')', 'gi'), replacer);
      }
      return input;
    };
  }]);
