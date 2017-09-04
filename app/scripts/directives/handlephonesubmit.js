'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:handlePhoneSubmit
 * @description
 * # handlePhoneSubmit
 */
angular.module('SubSnoopApp')
  .directive('handlePhoneSubmit', ['$window', function ($window) {

    /*
     Ensures that keyboard is automatically closed upon form submit for mobile screens.

     Certain pages will have redirects to new views on some form submits such as
     user searches on the main front page or the search bar in the top-nav.
    */
    return {
      restrict: 'AE',
      link: function postLink(scope, element, attrs) {
        var textFields = element.find('input');
        var page = attrs.page;

        element.on('submit', function() {
          textFields[0].blur();
          var username = textFields[0].value;

          if (attrs.redirect === 'true') {
            $window.location.assign('#/' + username + '/');  // Go to user's main page
            scope.$apply();
          }
        });
      }
    };
  }]);
