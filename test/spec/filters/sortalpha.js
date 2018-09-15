'use strict';

describe('Filter: sortAlpha', function () {

  // load the filter's module
  beforeEach(module('SubSnoopApp'));

  // initialize a new instance of the filter before each test
  var sortAlpha;
  beforeEach(inject(function (_sortAlphaFilter_) {
    sortAlpha = _sortAlphaFilter_;
  }));

  it("should return 1", function () {
    var firstKey = 'aa';
    var secondKey = 'ab';
    var result = sortAlpha(secondKey, firstKey);

    expect(result).toEqual(1);
  });

  it("should return -1", function () {
    var firstKey = 'aa';
    var secondKey = 'ab';
    var result = sortAlpha(firstKey, secondKey);

    expect(result).toEqual(-1);
  });

  it("should return 0", function () {
    var firstKey = 'aa';
    var secondKey = 'aa';
    var result = sortAlpha(firstKey, secondKey);

    expect(result).toEqual(0);
  });

});
