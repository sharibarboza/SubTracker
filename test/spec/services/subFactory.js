'use strict';

describe('Factory: subFactory', function () {

  // load the Factory's module
  beforeEach(module('tractApp'));

  // instantiate Factory
  var subFactory, userFactory;

  beforeEach(inject(function (_subFactory_, _userFactory_) {
    subFactory = _subFactory_;
    userFactory = _userFactory_;
    userFactory.setUser('BadLinguisticsBot');
    subFactory.setData();
  }));

  it('should do something', function () {
    expect(!!subFactory).toBe(true);
  });

  it('should return a promise', function () {
    var promise = subFactory.getData();
    expect(angular.isFunction(promise.then)).toBeTruthy();
  });

  it('should return comment list', function () {
    subFactory.getData().then(function() {
      expect(subFactory.getCommentList().length).not.toBeLessThan(0);
    });
  });

  it('should return submit list', function () {
    subFactory.getData().then(function() {
      expect(subFactory.getSubmitList().length).not.toBeLessThan(0);
    });
  });

  it('should have sub data', function () {
    subFactory.getData().then(function() {
      var subs = subFactory.getSubs();
      expect(subs.length).not.toBeLessThan(0); 

      for (var i = 0; i < subs.length; i++) {
        var sub = subs[i];
        expect(sub.comment_ups).not.toBe(undefined);
        expect(sub.submitted_ups).not.toBe(undefined);
        expect(sub.comments.length).not.toBeLessThan(0);
        expect(sub.submissions.length).not.toBeLessThan(0);
        expect(sub.recent_comment).not.toBe(undefined);
        expect(sub.recent_submission).not.toBe(undefined);
      }

    })
  });
});
