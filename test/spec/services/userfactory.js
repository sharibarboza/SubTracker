"use strict";

describe("test user factory", function () {
  var userFactory, httpBackend;

  beforeEach(module("SubSnoopApp"));
  beforeEach(module("views/main.html"));

  beforeEach(inject(function (_userFactory_, $httpBackend) {
    userFactory = _userFactory_;
    httpBackend = $httpBackend;
  }));

  it("should return data", function () {
    var username = 'reddit';

    httpBackend.expectGET('https://api.reddit.com/user/' + username + '/about.json').respond({
        data: {
          name: username
        }
    });

    var promise = userFactory.getData(username);
    promise.then(function(response) {
      expect(response.name).toEqual(username);
    });

    httpBackend.flush();

  });

});