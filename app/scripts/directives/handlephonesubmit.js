'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:handlePhoneSubmit
 * @description
 * # handlePhoneSubmit
 */
angular.module('SubSnoopApp')
  .directive('handlePhoneSubmit', ['$window', '$location', function ($window, $location) {

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
          var username = (textFields[0].value).trim();

          var currentUser;
          try {
            currentUser = localStorage.getItem('currentUser');

            if (!username) {
              username = currentUser;
            }
          } catch(e) {
          }

          if (attrs.redirect === 'true') {
            if (username.toLowerCase() === currentUser.toLowerCase().trim()) {
              if (page === 'home') {
                $location.path(username + '/subreddits');
                scope.$apply();
                location.reload();
              } else {
                location.reload();
              }
            } else {
              $location.path(username + '/subreddits/');  // Go to user's main page
              scope.$apply();
            }

          }
        });
      }
    };
  }]);
