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
    'ui.bootstrap',
    'yaru22.angular-timeago',
    'angular-jqcloud',
    'g1b.calendar-heatmap'
  ]);

var getData = function(route, factory) {
  var username = route.current.params.username;

  if (factory.checkUser(username)) {
    return factory.getSubData();
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
          return popularSubs.getData().then(function(response) {
            return response;
          });
        },
        newSubs: function(newSubs) {
          return newSubs.getData().then(function(response) {
            return response;
          });
        }
      },
      title: 'SubSnoop - Track your subreddit activity'
    })
    .when('/:username/', {
      templateUrl: 'views/user.html',
      controller: 'UserCtrl',
      controllerAs: 'user',
      resolve: {
        subsData: function($q, $route, subFactory) {
          return getData($route, subFactory); 
        }
      }
    })
    .when('/:username/search/', {
      templateUrl: 'views/search.html',
      controller: 'SearchCtrl',
      controllerAs: 'search',
      resolve: {
        subsData: function($route, subFactory) {
          return getData($route, subFactory);     
        }
      }
    })
    .when('/:username/:subreddit/', {
      templateUrl: 'views/sub.html',
      controller: 'UserSubCtrl',
      controllerAs: 'usersub',
      resolve: {
        subsData: function($route, subFactory) {
          return getData($route, subFactory);     
        }
      }
    })
    .when('/notfound/:username', {
      templateUrl: 'views/not-found.html'
    })
    .otherwise({
      redirectTo: '/'
    });
    $locationProvider.hashPrefix('');
}]);

app.run(['$rootScope', '$location', function($rootScope, $location) {

  $rootScope.$on('$routeChangeStart', function(e, curr, prev) { 
    if (curr.$$route && curr.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $rootScope.loadingView = true;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) { 
    // Hide loading message
    $rootScope.loadingView = false;
    $rootScope.title = curr.$$route.title;
  });

}]);