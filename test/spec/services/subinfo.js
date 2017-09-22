"use strict";

describe("test sub info factory", function () {
  var subInfo, httpBackend;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_subInfo_, $httpBackend) {
    subInfo = _subInfo_;
    httpBackend = $httpBackend;
  }));

  it("should return data", function () {
    var sub = 'pics';
    httpBackend.whenGET("https://api.reddit.com/r/" + sub + "/about.json").respond({
        data: {
          display_name: sub
        }
    });
    subInfo.getData(sub).then(function(response) {
      expect(response.display_name).toEqual(sub);
    });
    httpBackend.flush();
  });

});