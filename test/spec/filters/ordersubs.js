'use strict';

describe('Filter: orderSubs', function () {

  // load the filter's module
  beforeEach(module('tractApp'));

  // initialize a new instance of the filter before each test
  var filter, orderSubs, subFactory;
  beforeEach(inject(function ($filter, userFactory, _subFactory_) {
    filter = $filter;
    subFactory = _subFactory_;
    userFactory.setUser('BadLinguisticsBot');
    subFactory.setData();
  }));

  var testSort = function(attribute) {
    var promise = subFactory.getData();
    promise.then(function() {
      var subs = subFactory.getSubs();
      var keys = Object.keys(subs);

      var sortedData = filter('orderSubs')(keys, attribute, subs);
      expect(sortedData.length).not.toBeLessThan(0);

      for (var i = 0; i < sortedData.length; i++) {
        var a = sortedData[i];
        var b = sortedData[i+1];
        expect(a).toBeLessThan(b);
      }
    });
  };

  it('should sort name alphabetically', function() {
    testSort('subName');
  });

  it('should sort total comments numerically', function() {
    testSort('totalComments');
  });

  it('should sort total submitted numerically', function() {
    testSort('totalSubmits');
  });

  it('should sort total upvotes numerically', function() {
    testSort('totalUps');
  });

  it('should sort activity by most recent date', function() {
    testSort('lastSeen');
  });

  it('should sort activity numerically', function() {
    testSort('mostActive');
  });

  it('should sort comment average numerically', function() {
    testSort('avgComment');
  });

  it('should sort submit average numerically', function() {
    testSort('avgSubmit');
  });

  it('should sort downvotes numerically', function() {
    testSort('mostDown');
  });

});
