'use strict';

describe('Factory: subFactory', function () {

  // load the Factory's module
  beforeEach(module('tractApp'));

  // instantiate Factory
  var subFactory;

  beforeEach(inject(function (_subFactory_) {
    subFactory = _subFactory_;
    subFactory.setUser('autowikibot');
  }));

  it('should do something', function () {
    expect(!!subFactory).toBe(true);
  });

  it('should fetch comments and build list', function () {
    var commentListPromise = subFactory.setCommentList();
    expect(angular.isFunction(commentListPromise.then)).toBeTruthy();

    var comments = subFactory.getCommentList();
    expect(comments).not.toBe(undefined);
    expect(comments.length).not.toBeLessThan(0);
  });

  it('should fetch submissions and build list', function () {
    var submistListPromise = subFactory.setSubmitList();
    expect(angular.isFunction(submistListPromise.then)).toBeTruthy();

    var submissions = subFactory.getSubmitList();
    expect(submissions).not.toBe(undefined);
    expect(submissions.length).not.toBeLessThan(0);
  });

  it('should create comments list in subs dictionary', function () {
    subFactory.setCommentList();
    var comments = subFactory.getCommentList();
    subFactory.organizeComments(comments);

    var subs = subFactory.getSubs();
    expect(subs).not.toBe(undefined);

    for (var i = 0; i < subs.length; i++) {
      var comments = subs[i].comments;
      expect(comments.length).not.toBeLessThan(0);
    }
  });

  it('should create submit list in subs dictionary', function () {
    subFactory.setSubmitList();
    var submissions = subFactory.getSubmitList();
    subFactory.organizeSubmitted(submissions);

    var subs = subFactory.getSubs();
    expect(subs).not.toBe(undefined);

    for (var i = 0; i < subs.length; i++) {
      var submissions = subs[i].submissions;
      expect(submissions.length).not.toBeLessThan(0);
    }
  });

  it('should reset data when setting user', function () {
    subFactory.setCommentList();
    subFactory.setSubmitList();

    subFactory.organizeComments(subFactory.getCommentList());
    subFactory.organizeSubmitted(subFactory.getSubmitList());

    subFactory.setUser('autowikibot');
    expect(subFactory.getCommentList().length).toBe(0);
    expect(subFactory.getSubmitList().length).toBe(0);
    expect(Object.keys(subFactory.getSubs()).length).toBe(0);
  });

});
