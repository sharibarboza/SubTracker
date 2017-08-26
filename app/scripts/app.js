'use strict';

/**
 * @ngdoc overview
 * @name SubSnoopApp
 * @description
 * # SubSnoopApp
 *
 * Main module of the application.
 */
var app = angular
  .module('SubSnoopApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'angularMoment',
    'ui.bootstrap'
  ]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main',
      resolve: {
        popularSubs: function(popularSubs) {
          var promise = popularSubs.getData();
          return promise;
        },
        newSubs: function(newSubs) {
          var promise = newSubs.getData();
          return promise;
        }
      }
    })
    .when('/:username', {
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',
      controllerAs: 'user',
      resolve: {
        userData: function($route, userFactory) {
          var username = $route.current.params.username;
          if ('user' in sessionStorage && sessionStorage.user.toLowerCase() === username.toLowerCase()) {
            return null;
          } else {
            var promise = userFactory.getData(username);  
            return promise;
          }
        },
        subData: function($route, subFactory) {
          var username = $route.current.params.username;

          if ('user' in sessionStorage && sessionStorage.user.toLowerCase() === username.toLowerCase()) {
            return null;
          } else {
            var promise = subFactory.setSubs(username);  
            return promise; 
          }        
        }
      }
    })
    .when('/:username/:subreddit', {
      templateUrl: 'views/sub.html',
      controller: 'UserSubCtrl',
      controllerAs: 'sub'
    })
    .otherwise({
      redirectTo: '/'
    });
    $locationProvider.hashPrefix('');
}]);

app.run(['$rootScope', function($root) {

  $root.$on('$routeChangeStart', function(e, curr, prev) { 
    if (curr.$$route && curr.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $root.loadingView = true;
    }
  });

  $root.$on('$routeChangeSuccess', function(e, curr, prev) { 
    // Hide loading message
    $root.loadingView = false;
  });

}]);