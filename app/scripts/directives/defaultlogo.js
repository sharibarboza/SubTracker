'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:defaultLogo
 * @description
 * # defaultLogo
 */
angular.module('SubSnoopApp')
  .directive('defaultLogo', ['$compile', function ($compile) {

    var colors = ['#f96854', '#15B1BF', '#E975BF', '#AA60CC', '#4736C0', '#1DA1F2', '#80AE04'];
    var numColors = colors.length;

    /*
     Jump back to top of page with a 'Back to Top' link and up-arrow
    */
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        var sub = attrs.sub;
        var letter = sub[0].toUpperCase();
        var convertedLetter = parseInt(letter);

        var num;
        if (convertedLetter >= 0) {
          num = convertedLetter;
        } else {
          num = letter.charCodeAt(0) - 65;
        }
        var mod = num % numColors;
        var chosenColor = colors[mod];

        var sizeLogo = 'sub-logo';
        if (attrs.page === 'home') {
          sizeLogo = 'main-logo';
        } else if (attrs.page === 'profile') {
          sizeLogo = 'profile-logo';
        }

        var logo = '<div class="default-logo ' + sizeLogo + '" style="background-color: ' + chosenColor +'">' + letter + '</div>';
        element.html(logo);
        $compile(element.contents())(scope);
      }
    };
  }]);
