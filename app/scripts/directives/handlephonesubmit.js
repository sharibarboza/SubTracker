'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:handlePhoneSubmit
 * @description
 * # handlePhoneSubmit
 */
angular.module('SubSnoopApp')
  .directive('handlePhoneSubmit', ['$window', function ($window) {

    return {
      restrict: 'AE',
      scope: {
        redirect: '@'
      },
      link: function postLink(scope, element, attrs) {
        var textFields = element.find('input');

        element.on('submit', function() {
          textFields[0].blur();
          var username = textFields[0].value;

          if (attrs.redirect === 'true') {
            $window.location.assign('#/' + username + '/');
            scope.$apply();
          }
        });
      }
    };
  }]);
