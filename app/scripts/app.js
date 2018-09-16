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
    'g1b.calendar-heatmap',
    'angularLazyImg'
  ]);

/*
 Used to get data from the subFactory
 */
var getData = function(route, subFactory, userFactory) {
  var username = route.current.params.username;

  if (subFactory.checkUser(username)) {
    return subFactory.getSubData();
  } else {
    var userPromise = userFactory.getData(username);
    return userPromise.then(function(response) {
      return subFactory.getData(response);
    });
  }
};

app.config(['$routeProvider', '$locationProvider', 'lazyImgConfigProvider', function ($routeProvider, $locationProvider, lazyImgConfigProvider) {
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
        subsData: function($q, $route, subFactory, userFactory) {
          return getData($route, subFactory, userFactory);
        }
      }
    })
    .when('/:username/search/', {
      templateUrl: 'views/search.html',
      controller: 'SearchCtrl',
      controllerAs: 'search',
      resolve: {
        subsData: function($route, subFactory, userFactory) {
          return getData($route, subFactory, userFactory);
        }
      }
    })
    .when('/:username/:subreddit/', {
      templateUrl: 'views/sub.html',
      controller: 'UserSubCtrl',
      controllerAs: 'usersub',
      resolve: {
        subsData: function($route, subFactory, userFactory) {
          return getData($route, subFactory, userFactory);
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

  /*
   If after searching for a subreddit name, display the loading progress bar
   before loading the rest of the page
   */
  $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
    var userUrls = ['views/user.html', 'views/sub.html', 'views/search.html'];
    $rootScope.path = curr.$$route.templateUrl;
    $rootScope.userPath = userUrls.indexOf($rootScope.path) >= 0;

    if (prev !== undefined) {
      $rootScope.redirect = prev.$$route.redirectTo;
    }

    var loading;
    if (curr === undefined || prev === undefined) {
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
      } else if (username1 === username2 && $rootScope.redirect !== undefined) {
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

  /*
   Hide the loading progress bar and display the page
   */
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