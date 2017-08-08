'use strict';

describe('Filter: orderSubs', function () {

  // load the filter's module
  beforeEach(module('tractApp'));

  // initialize a new instance of the filter before each test
  var orderSubs;
  beforeEach(inject(function ($filter) {
    orderSubs = $filter('orderSubs');
  }));

  it('should return the input prefixed with "orderSubs filter:"', function () {
    var text = 'angularjs';
    expect(orderSubs(text)).toBe('orderSubs filter: ' + text);
  });

});
