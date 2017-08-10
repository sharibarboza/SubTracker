'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var UserCtrl,
    scope,
    routeParams,
    userFactory,
    userPromise
    moment;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$routeParams_, _userFactory_, _moment_) {
    scope = $rootScope.$new();
    routeParams = _$routeParams_;
    routeParams.username = 'BadLinguisticsBot';
    userFactory = _userFactory_;
    moment = _moment_;

    UserCtrl = $controller('UserCtrl', {
      $scope: scope,
      $routeParams: routeParams,
      userFactory: userFactory,
      moment: moment
    });

  }));

  it('should have false main', function() {
    expect(scope.main).toBe(false);
  });

  it('should have username param', function() {
    expect(routeParams.username).toBe('BadLinguisticsBot');
  });

  it('should have user data', function() {
    userFactory.setUser(routeParams.username);
    var userPromise = userFactory.getUser();
    expect(userPromise).not.toBe(undefined);
    expect(angular.isFunction(userPromise.then)).toBeTruthy();

    userPromise.then(function(response) {
      expect(response.data.data.name).toBe(routeParams.username);
    });
  });


});
