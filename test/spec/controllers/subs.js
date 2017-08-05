'use strict';

describe('Controller: SubsCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var SubsCtrl,
    scope,
    userFactory,
    subFactory,
    username = 'autowikibot';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _userFactory_, _subFactory_) {
    scope = $rootScope.$new();
    userFactory = _userFactory_;
    subFactory = _subFactory_;
    userFactory.setUser(username);

    SubsCtrl = $controller('SubsCtrl', {
      $scope: scope,
      subFactory: subFactory
    });
  }));

  it('should have true processing', function() {
    expect(scope.processing).toBe(true);
  });

  it('should have false ready', function() {
    expect(scope.ready).toBe(false);
  });

  it('should have sub data', function() {
    var promise = subFactory.getData();
    expect(angular.isFunction(promise.then)).toBeTruthy();

    promise.then(function() {
      expect(subFactory.getCommentList()).not.toBe(undefined);
      expect(subFactory.getSubmitList()).not.toBe(undefined);
      expect(subFactory.getSubs()).not.toBe(undefined);
    })
  });

});
