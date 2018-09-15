'use strict';

describe('Filter: sortNum', function () {

  // load the filter's module
  beforeEach(module('SubSnoopApp'));

  // initialize a new instance of the filter before each test
  var sortNum;
  var sortAlpha;
  var moment;
  beforeEach(inject(function (_sortNumFilter_, _sortAlphaFilter_, _moment_) {
    sortNum = _sortNumFilter_;
    sortAlpha = _sortAlphaFilter_;
    moment = _moment_;
  }));

  it("false reverse should return 1", function () {
    var num1 = 1;
    var num2 = 0;

    var a = 'subA';
    var b = 'subB';
    var result = sortNum(num1, num2, a, b, false, null);

    expect(result).toEqual(1);
  });

  it("false reverse should return -1", function () {
    var num1 = 0;
    var num2 = 1;

    var a = 'subA';
    var b = 'subB';
    var result = sortNum(num1, num2, a, b, false, null);

    expect(result).toEqual(-1);
  });

  it("reverse should return 1", function () {
    var num1 = 0;
    var num2 = 1;

    var a = 'subA';
    var b = 'subB';
    var result = sortNum(num1, num2, a, b, true, null);

    expect(result).toEqual(1);
  });

  it("reverse should return -1", function () {
    var num1 = 1;
    var num2 = 0;

    var a = 'subA';
    var b = 'subB';
    var result = sortNum(num1, num2, a, b, true, null);

    expect(result).toEqual(-1);
  });

  it("equal values should sort alphabetically", function () {
    var num1 = 1;
    var num2 = 1;

    var a = 'subA';
    var b = 'subB';
    var result1 = sortNum(num1, num2, a, b, true, 'alpha');
    var result2 = sortNum(num1, num2, a, b, true, null);

    expect(result1).toEqual(-1);
    expect(result2).toEqual(-1);
  });

  it("equal values should sort by most recent date", function () {
    var num1 = 1;
    var num2 = 1;

    var a = {
      created_utc: 1492900982.0,  // most recent date
      subreddit: 'subA'
    };
    var b = {
      created_utc: 1492832281.0,
      subreddit: 'subB'
    };
    var result = sortNum(num1, num2, a, b, true, 'date');

    expect(result).toEqual(-1);
  });

  it("equal values and equal dates should sort alphabetically", function () {
    var num1 = 1;
    var num2 = 1;

    var a = {
      created_utc: 1492900982.0,  // most recent date
      subreddit: 'subA'
    };
    var b = {
      created_utc: 1492900982.0,
      subreddit: 'subB'
    };
    var result = sortNum(num1, num2, a, b, true, 'alpha');

    expect(result).toEqual(-1);
  });

});
