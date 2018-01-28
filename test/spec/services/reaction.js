"use strict";

describe("test reaction factory", function () {
  var reaction, httpBackend;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_reaction_) {
    reaction = _reaction_;
  }));

  it('should return the correct reaction data', function() {
    var subData = {
      'sub1' : { 
        'comments' : [{ 'ups' : 1 }, { 'ups' : 100 }, { 'ups' : 0 }, { 'ups' : -50 }, { 'ups' : -25 }],
        'submissions' : [{ 'ups' : 20 }, { 'ups' : 1 }, { 'ups' : 500 }]
       }
    };

    reaction.setSubData(subData);
    var result = reaction.getData('sub1');

    expect(Object.keys(result).length).toEqual(3);

    expect(result.values[0].label).toEqual('Upvoted');
    expect(result.values[0].value).toEqual(3);
    expect(result.values[0].percent).toEqual('37.5');

    expect(result.values[1].label).toEqual('Neutral');
    expect(result.values[1].value).toEqual(2);
    expect(result.values[1].percent).toEqual('25.0');

    expect(result.values[2].label).toEqual('Downvoted');
    expect(result.values[2].value).toEqual(3);
    expect(result.values[2].percent).toEqual('37.5');
  });

  it('should return data with zero submissions', function() {
    var subData = {
      'sub1' : {
        'comments' : [{ 'ups' : 0 }],
        'submissions' : []
      }
    };

    reaction.setSubData(subData);
    var result = reaction.getData('sub1');

    expect(Object.keys(result).length).toEqual(3);

    expect(result.values[0].label).toEqual('Upvoted');
    expect(result.values[0].value).toEqual(0);
    expect(result.values[0].percent).toEqual('0.0');

    expect(result.values[1].label).toEqual('Neutral');
    expect(result.values[1].value).toEqual(0);
    expect(result.values[0].percent).toEqual('0.0');

    expect(result.values[2].label).toEqual('Downvoted');
    expect(result.values[2].value).toEqual(1);
    expect(result.values[2].percent).toEqual('100.0');

  });

  it('should return null data on non-existent sub', function() {
    var result = reaction.getData('sub2');

    expect(result).toEqual(null);
  });

});