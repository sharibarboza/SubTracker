"use strict";

describe("test user factory", function () {
  var userFactory, httpBackend;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_userFactory_, $httpBackend) {
    userFactory = _userFactory_;
    httpBackend = $httpBackend;
  }));

  it("should return data", function () {
    var user = 'reddit';
    httpBackend.whenGET('https://api.reddit.com/user/' + user + '/about.json').respond({
        data: {
          name: user
        }
    });
    userFactory.getData(user).then(function(response) {
      expect(response.name).toEqual(user);
    });
    httpBackend.flush();
  });

});