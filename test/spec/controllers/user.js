'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var UserCtrl,
    scope,
    routeParams,
    userService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$routeParams_, _userService_, subService) {
    scope = $rootScope.$new();
    routeParams = _$routeParams_;
    routeParams.username = 'autowikibot';
    userService = _userService_;

    UserCtrl = $controller('UserCtrl', {
      $scope: scope,
      $routeParams: routeParams,
      userService: userService,
      subService: subService
    });
  }));

  it('should complete processing', function () {
    expect(scope.processing).toBe(true);
  });

  it('should not be ready', function() {
    expect(scope.ready).toBe(false);
  });

  it('should have username param', function() {
    expect(routeParams.username).toBe('autowikibot');
  });

});
