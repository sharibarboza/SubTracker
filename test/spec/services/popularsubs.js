"use strict";

describe("test popular subs factory", function () {
  var popularSubs, httpBackend;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_popularSubs_, $httpBackend) {
    popularSubs = _popularSubs_;
    httpBackend = $httpBackend;
  }));

  it("should return data", function () {
    httpBackend.whenGET("https://api.reddit.com/subreddits.json").respond({
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
    popularSubs.getData().then(function(response) {
      expect(response.length).toEqual(4);
      expect(response[0].display_name).toEqual("AskReddit");
    });
    httpBackend.flush();
  });

});
