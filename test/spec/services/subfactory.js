"use strict";

describe("test subs factory", function () {
  var userFactory, subFactory, subInfo, httpBackend;
  var user;
  var subData;

  const username = 'reddit';
  const date1 = 1506846658; // October 1, 2017
  const date2 = 1506947458; // October 2, 2017
  const date3 = 1507030258; // October 3, 2017

  beforeEach(module("SubSnoopApp"));
  beforeEach(module("views/main.html"));

  beforeEach(inject(function (_userFactory_, _subFactory_, _subInfo_, $httpBackend) {
    userFactory = _userFactory_;
    subFactory = _subFactory_;
    subInfo = _subInfo_;
    httpBackend = $httpBackend;

    httpBackend.expectGET('https://api.reddit.com/user/' + username + '/about.json').respond({
        data: {
          name: username
        }
    });

    userFactory.getData(username).then(function(response) {
      user = response;
    });

    httpBackend.flush();

    const after = '0';

    httpBackend.expectGET('https://api.reddit.com/user/'+username+'/comments.json?limit=100&after='+after).respond({
          data: {
              children: [
                  {
                      data: {
                          subreddit: 'sub2',
                          ups: -1,
                          created_utc: date2
                      }
                  },
                  {
                      data: {
                          subreddit: 'sub1',
                          ups: 2,
                          gilded: 1,
                          created_utc: date1
                      }
                  }
              ]
          }
    });

    httpBackend.expectGET('https://api.reddit.com/user/'+username+'/submitted.json?limit=100&after='+after).respond({
          data: {
              children: [
                  {
                      data: {
                          subreddit: 'sub1',
                          ups: 3,
                          created_utc: date3
                      }
                  }
              ]
          }
    });

    subFactory.getData(user).then(function(response) {
        subData = response;
    });

    httpBackend.flush();

  }));

  it('should return sub data', function() {
      if (subData) {
          expect(subData.user.name).toEqual(username);
          expect(subData.comments).toEqual(2);
          expect(subData.submissions).toEqual(1);
          expect(subData.upvotes).toEqual(4);

          expect(Object.keys(subData.subs).length).toEqual(2);
          expect(subData.subs['sub1'].comment_ups).toEqual(2);
          expect(subData.subs['sub2'].comment_ups).toEqual(-1);

          expect(subData.subs['sub1'].submission_ups).toEqual(3);
          expect(subData.subs['sub1'].gilded_comments).toEqual(1);
          expect(subData.subs['sub1'].gilded_submissions).toEqual(0);

          expect(subFactory.getSubLength()).toEqual(2);
      }

  });

  it('should return comments list', function() {
     if (subData) {
         const comments = subFactory.getCommentsList();
         expect(comments.length).toEqual(2);

         const comment1 = comments[1];
         const comment2 = comments[0];
         expect(comment1.type).toEqual('comment');
         expect(comment1.subreddit).toEqual('sub1');
         expect(comment1.ups).toEqual(2);

         expect(comment2.type).toEqual('comment');
         expect(comment2.subreddit).toEqual('sub2');
         expect(comment2.ups).toEqual(-1);
     }
  });

  it('should return submissions list', function() {
     if (subData) {
         const submissions = subFactory.getSubmitsList();
         expect(submissions.length).toEqual(1);

         const submit1 = submissions[0];
         expect(submit1.type).toEqual('submit');
         expect(submit1.subreddit).toEqual('sub1');
         expect(submit1.ups).toEqual(3);
     }
  });

  it('should return first post date', function() {
    if (subData) {
        expect(subFactory.getFirstPost(null)).toEqual(date1);
    }
  });

  it('should return first post date from sub1', function() {
     if (subData) {
         const sub1 = subData.subs['sub1'];
         expect(subFactory.getFirstPost(sub1)).toEqual(date1);
     }
  });

  it('should return first post date from sub2', function() {
     if (subData) {
         const sub2 = subData.subs['sub2'];
         expect(subFactory.getFirstPost(sub2)).toEqual(date2);
     }
  });

  it('should return latest post date', function() {
     if (subData) {
         expect(subFactory.getLatestPost(null)).toEqual(date3);
     }
  });

  it('should return latest post date from sub1', function() {
     if (subData) {
         const sub1 = subData.subs['sub1'];
         expect(subFactory.getLatestPost(sub1)).toEqual(date3);
     }
  });

  it('should return latest post date from sub2', function() {
     if (subData) {
         const sub2 = subData.subs['sub2'];
         expect(subFactory.getLatestPost(sub2)).toEqual(date2);
     }
  });

  it('should return top comment', function() {
     if (subData) {
         const topComment = subFactory.getTopComment();
         expect(topComment[0]).toEqual(2);
         expect(topComment[1]).toEqual('sub1');
     }
  });

  it('should return top submit', function() {
     if (subData) {
         const topSubmit = subFactory.getTopSubmit();
         expect(topSubmit[0]).toEqual(3);
         expect(topSubmit[1]).toEqual('sub1');
     }
  });

  it('should compare two posts and return the newest', function() {
     if (subData) {
         const post1 = subData.subs['sub1'].comments[0];
         const post2 = subData.subs['sub1'].submissions[0];
         expect(subFactory.compareDates(post1, post2, true)).toBe(post2);
     }
  });

  it('should compare two posts and return the oldest', function() {
     if (subData) {
         const post1 = subData.subs['sub1'].comments[0];
         const post2 = subData.subs['sub1'].submissions[0];
         expect(subFactory.compareDates(post1, post2, false)).toBe(post1);
     }
  });

  it('should return the newest sub', function() {
     if (subData) {
         expect(subFactory.getNewestSub()).toEqual('sub2');
     }
  });

  it('should set sub info', function() {
     if (subData) {
         const subscribers = 1000;
         httpBackend.expectGET("https://api.reddit.com/r/sub1/about.json").respond({
             data: {
                 subscribers: subscribers
             }
         });

         var info;
         subInfo.getData('sub1').then(function(response) {
             info = response;
         });

         httpBackend.flush();

         if (info) {
            subFactory.setSubInfo('sub1', info);
            var data = subFactory.getSubData();
            expect(data.subs['sub1'].info.subscribers).toEqual(subscribers);
         }

     }
  });

  it('should not set sub info', function() {
     if (subData) {
        httpBackend.expectGET("https://api.reddit.com/r/sub3/about.json").respond({
           data: {
               subscribers: 1000
           }
        });

        var info;
        subInfo.getData('sub3').then(function(response) {
           info = response;
        });

        httpBackend.flush();

        if (info) {
            expect(function() {
                return subFactory.setSubInfo('sub3', info);
            }).toThrow("sub3 does not exist in reddit's subreddits.");
        }
     }
  });


});