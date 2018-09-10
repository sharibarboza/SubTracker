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

app.run(['$rootScope', '$location', '$interval', '$timeout', function($rootScope, $location, $interval, $timeout) {

  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
    var userUrls = ['views/user.html', 'views/sub.html', 'views/search.html'];
    $rootScope.path = curr.$$route.templateUrl;
    $rootScope.userPath = userUrls.indexOf($rootScope.path) >= 0;

    if (prev !== undefined) {
      $rootScope.redirect = prev.$$route.redirectTo;
    }

    var loading;
    if (curr == undefined || prev == undefined) {
      loading = true;
    } else {
      if (curr.pathParams.username !== undefined) {
          var username1 = curr.pathParams.username.toLowerCase();
      }
      if (prev.pathParams.username !== undefined) {
          var username2 = prev.pathParams.username.toLowerCase();
      }

      if (username1 !== username2) {
        loading = true;
      } else if (username1 == username2 && $rootScope.redirect !== undefined) {
        loading = true;
        $rootScope.redirect = undefined;
      }
    }

    if (curr.$$route && curr.$$route.resolve && loading) {
      // Show a loading message until promises are not resolved
      $rootScope.loadingView = true;
      $rootScope.loadingUser = curr.pathParams.username;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
    var d = [2000, 2000];
    $rootScope.$emit('subCount', d);

    $timeout(function() {
      $rootScope.loadingView = false;
      $rootScope.title = curr.$$route.title;
      $rootScope.subCount = 0;
      $rootScope.subMsg = 0;
    }, 500);
  });

}]);