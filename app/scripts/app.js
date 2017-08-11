'use strict';

/**
 * @ngdoc overview
 * @name tractApp
 * @description
 * # tractApp
 *
 * Main module of the application.
 */
angular
  .module('tractApp', [
    'ngAnimate',
    'ngRoute',
    'ngMaterial',
    'angularMoment',
    'ui.bootstrap'
  ])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/:username', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        controllerAs: 'user'
      })
      .when('/:username/:subreddit', {
        templateUrl: 'views/sub.html',
        controller: 'UsersubCtrl',
        controllerAs: 'sub'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  }]);
