'use strict';

describe('Controller: SubsCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var SubsCtrl,
    scope,
    amMoment,
    $window,
    subFactory,
    $filter,
    username = 'BadLinguisticsBot';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, userFactory, _subFactory_, _amMoment_, _$filter_, _$window_) {
    scope = $rootScope.$new();
    amMoment = _amMoment_;
    $filter = _$filter_;
    $window = _$window_;
    subFactory = _subFactory_;
    userFactory.setUser(username);

    SubsCtrl = $controller('SubsCtrl', {
      $scope: scope,
      subFactory: subFactory,
      amMoment: amMoment,
      $filter: $filter,
      $window, $window
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
