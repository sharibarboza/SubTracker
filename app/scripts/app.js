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

var getData = function(route, factory, storage) {
  var username = route.current.params.username;
  if (storage.userExists(username)) {
    return null;
  } else {
    var promise = factory.getData(username);  
    return promise;
  }
};

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
        userData: function($route, userFactory, checkStorage) {
          return getData($route, userFactory, checkStorage);
        },
        subsData: function($route, subFactory, checkStorage) {
          return getData($route, subFactory, checkStorage);     
        }
      }
    })
    .when('/:username/:subreddit', {
      templateUrl: 'views/sub.html',
      controller: 'UserSubCtrl',
      controllerAs: 'usersub',
      resolve: {
        userData: function($route, userFactory, checkStorage) {
          return getData($route, userFactory, checkStorage);
        },
        subsData: function($route, subFactory, checkStorage) {
          return getData($route, subFactory, checkStorage);     
        }
      }
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