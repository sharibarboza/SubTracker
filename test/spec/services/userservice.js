'use strict';

describe('Service: userService', function () {

  // load the service's module
  beforeEach(module('tractApp'));

  // instantiate service
  var userService,
    userPromise,
    commentPromise,
    submitPromise;

  beforeEach(inject(function (_userService_) {
    userService = _userService_;
    userPromise = userService.getAbout('autowikibot');
    commentPromise = userService.getComments('autowikibot', 'first');
    submitPromise = userService.getSubmitted('autowikibot', 'first');
  }));

  it('should do something', function () {
    expect(!!userService).toBe(true);
  });

  it('should return user promise', function() {
    expect(userPromise).not.toBe(undefined);
    expect(angular.isFunction(userPromise.then)).toBeTruthy();

    userPromise.then(function(response) {
      expect(response.data.data.name).toBe('autowikibot');
    });
  });

  it('should return comment promise', function() {
    expect(commentPromise).not.toBe(undefined);
    expect(angular.isFunction(commentPromise.then)).toBeTruthy();
  });

  it('should return submit promise', function() {
    expect(submitPromise).not.toBe(undefined);
    expect(angular.isFunction(submitPromise.then)).toBeTruthy();   
  });
});
