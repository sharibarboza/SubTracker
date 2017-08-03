'use strict';

describe('Service: subService', function () {

  // load the service's module
  beforeEach(module('tractApp'));

  // instantiate service
  var subService;

  beforeEach(inject(function (_subService_) {
    subService = _subService_;
  }));

  it('should do something', function () {
    expect(!!subService).toBe(true);
  });

});
