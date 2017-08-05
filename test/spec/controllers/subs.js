'use strict';

describe('Controller: SubsCtrl', function () {

  // load the controller's module
  beforeEach(module('tractApp'));

  var SubsCtrl,
    scope,
    userService,
    subService,
    username = 'autowikibot';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _userService_, _subService_) {
    scope = $rootScope.$new();
    userService = _userService_;
    subService = _subService_;
    userService.setUser(username);

    SubsCtrl = $controller('SubsCtrl', {
      $scope: scope,
      userService: userService,
      subService: subService
    });
  }));

  it('should have true processing', function() {
    expect(scope.processing).toBe(true);
  });

  it('should have false ready', function() {
    expect(scope.ready).toBe(false);
  });

  it('should have sub data', function() {
    var userPromise = userService.getUser();
    userPromise.then(function(response) {
      subService.setUser(username);
      return subService.setCommentList();
    })
    .then(function(response) {
      var comments = subService.getCommentList();
      expect(comments).not.toBe(undefined);
      subService.setSubmitList();

      var submissions = subService.getSubmitList();
      expect(submissions).not.toBe(undefined);
      subService.organizeComments(comments);
      subService.organizeSubmitted(submissions);

      var subs = subService.getSubs();
      expect(subs).not.toBe(undefined);

    });
  });

});
