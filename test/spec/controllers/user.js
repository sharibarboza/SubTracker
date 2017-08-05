'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var UserCtrl,
    scope,
    routeParams,
    userService,
    userPromise;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$routeParams_, _userService_) {
    scope = $rootScope.$new();
    routeParams = _$routeParams_;
    routeParams.username = 'autowikibot';
    userService = _userService_;

    UserCtrl = $controller('UserCtrl', {
      $scope: scope,
      $routeParams: routeParams,
      userService: userService
    });

  }));

  it('should have false main', function() {
    expect(scope.main).toBe(false);
  });

  it('should have username param', function() {
    expect(routeParams.username).toBe('autowikibot');
  });

  it('should have user data', function() {
    userService.setUser(routeParams.username);
    var userPromise = userService.getUser();
    expect(userPromise).not.toBe(undefined);
    expect(angular.isFunction(userPromise.then)).toBeTruthy();

    userPromise.then(function(response) {
      expect(response.data.data.name).toBe(routeParams.username);
    });
  });


});
