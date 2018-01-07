'use strict';

describe('Filter: username', function () {

  // load the filter's module
  beforeEach(module('SubSnoopApp'));

  // initialize a new instance of the filter before each test
  var usernameFilter;

  beforeEach(inject(function (_usernameFilter_) {
    usernameFilter = _usernameFilter_;
  }));

  it('should return the input with only the username', function () {
    expect(usernameFilter('u/test_username')).toBe('test_username');
  });

});
