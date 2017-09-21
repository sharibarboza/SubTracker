"use strict";

describe("test new subs factory", function () {
  var newSubs, httpBackend;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_newSubs_, $httpBackend) {
    newSubs = _newSubs_;
    httpBackend = $httpBackend;
  }));

  it("should return data", function () {
    httpBackend.whenGET("https://api.reddit.com/subreddits/new.json").respond({
        data: {
          children: [
            {
              data: {
                display_name: "AskReddit"
              }
            },
            {
              data: {
                display_name: "mildyinteresting"
              }
            },
            {
              data: {
                display_name: "politics"
              }
            },
            {
              data: {
                display_name: "todayilearned"
              }
            }
          ]
        }
    });
    newSubs.getData().then(function(response) {
      expect(response.length).toEqual(4);
      expect(response[1].display_name).toEqual("mildyinteresting");
    });
    httpBackend.flush();
  });

});