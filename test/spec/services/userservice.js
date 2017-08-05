'use strict';

describe('Service: userService', function () {

  // load the service's module
  beforeEach(module('tractApp'));

  // instantiate service
  var userService;

  beforeEach(inject(function (_userService_) {
    userService = _userService_;
    userService.setUser('autowikibot');
  }));

  it('should do something', function () {
    expect(!!userService).toBe(true);
  });

  it('should return user promise', function() {
    var userPromise = userService.getUser();
    expect(userPromise).not.toBe(undefined);
    expect(angular.isFunction(userPromise.then)).toBeTruthy();

    userPromise.then(function(response) {
      expect(response.data.data.name).toBe('autowikibot');
    });
  });

});