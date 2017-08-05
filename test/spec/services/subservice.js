'use strict';

describe('Service: subService', function () {

  // load the service's module
  beforeEach(module('tractApp'));

  // instantiate service
  var subService;

  beforeEach(inject(function (_subService_) {
    subService = _subService_;
    subService.setUser('autowikibot');
  }));

  it('should do something', function () {
    expect(!!subService).toBe(true);
  });

  it('should fetch comments and build list', function () {
    var commentListPromise = subService.setCommentList();
    expect(angular.isFunction(commentListPromise.then)).toBeTruthy();

    var comments = subService.getCommentList();
    expect(comments).not.toBe(undefined);
    expect(comments.length).not.toBeLessThan(0);
  });

  it('should fetch submissions and build list', function () {
    var submistListPromise = subService.setSubmitList();
    expect(angular.isFunction(submistListPromise.then)).toBeTruthy();

    var submissions = subService.getSubmitList();
    expect(submissions).not.toBe(undefined);
    expect(submissions.length).not.toBeLessThan(0);
  });

  it('should create comments list in subs dictionary', function () {
    subService.setCommentList();
    var comments = subService.getCommentList();
    subService.organizeComments(comments);

    var subs = subService.getSubs();
    expect(subs).not.toBe(undefined);

    for (var i = 0; i < subs.length; i++) {
      var comments = subs[i].comments;
      expect(comments.length).not.toBeLessThan(0);
    }
  });

  it('should create submit list in subs dictionary', function () {
    subService.setSubmitList();
    var submissions = subService.getSubmitList();
    subService.organizeSubmitted(submissions);

    var subs = subService.getSubs();
    expect(subs).not.toBe(undefined);

    for (var i = 0; i < subs.length; i++) {
      var submissions = subs[i].submissions;
      expect(submissions.length).not.toBeLessThan(0);
    }
  });

  it('should reset data when setting user', function () {
    subService.setCommentList();
    subService.setSubmitList();

    subService.organizeComments(subService.getCommentList());
    subService.organizeSubmitted(subService.getSubmitList());

    subService.setUser('autowikibot');
    expect(subService.getCommentList().length).toBe(0);
    expect(subService.getSubmitList().length).toBe(0);
    expect(Object.keys(subService.getSubs()).length).toBe(0);
  });

});
