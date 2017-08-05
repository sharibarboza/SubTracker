'use strict';

describe('Controller: SubsCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var SubsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubsCtrl = $controller('SubsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SubsCtrl.awesomeThings.length).toBe(3);
  });
});
