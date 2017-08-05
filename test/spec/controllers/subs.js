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
      userFactory: userFactory,
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
    var userPromise = userFactory.getUser();
    userPromise.then(function(response) {
      subFactory.setUser(username);
      return subFactory.setCommentList();
    })
    .then(function(response) {
      var comments = subFactory.getCommentList();
      expect(comments).not.toBe(undefined);
      subFactory.setSubmitList();

      var submissions = subFactory.getSubmitList();
      expect(submissions).not.toBe(undefined);
      subFactory.organizeComments(comments);
      subFactory.organizeSubmitted(submissions);

      var subs = subFactory.getSubs();
      expect(subs).not.toBe(undefined);

    });
  });

});
