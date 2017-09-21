"use strict";

describe("test sortalpha service", function () {
  var sortAlpha;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_sortAlpha_) {
    sortAlpha = _sortAlpha_;
  }));

  it("should return 1", function () {
    var firstKey = 'aa';
    var secondKey = 'ab';
    var result = sortAlpha.get(secondKey, firstKey);

    expect(result).toEqual(1);
  });

  it("should return -1", function () {
    var firstKey = 'aa';
    var secondKey = 'ab';
    var result = sortAlpha.get(firstKey, secondKey);

    expect(result).toEqual(-1);
  });

  it("should return 0", function () {
    var firstKey = 'aa';
    var secondKey = 'aa';
    var result = sortAlpha.get(firstKey, secondKey);

    expect(result).toEqual(0);
  });

});
