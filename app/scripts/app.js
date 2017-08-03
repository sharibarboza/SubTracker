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
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.hashPrefix('');
  }]);
