'use strict';

describe('Factory: userFactory', function () {

  // load the factory's module
  beforeEach(module('tractApp'));

  // instantiate factory
  var userFactory;

  beforeEach(inject(function (_userFactory_) {
    userFactory = _userFactory_;
    userFactory.setUser('autowikibot');
  }));

  it('should do something', function () {
    expect(!!userFactory).toBe(true);
  });

  it('should return user promise', function() {
    var userPromise = userFactory.getUser();
    expect(userPromise).not.toBe(undefined);
    expect(angular.isFunction(userPromise.then)).toBeTruthy();

    userPromise.then(function(response) {
      expect(response.data.data.name).toBe('autowikibot');
    });
  });

});