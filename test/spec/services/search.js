"use strict";

describe("test search service", function () {
  var search;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_search_) {
    search = _search_;
  }));

  it("should return search results", function () {
    var data = ['complete', 'compile', 'autocomplete', 'comment', 'cooking', 'accomplish'];
    var results = search.findSubs(data, 'comp');

    expect(results).toEqual(['complete', 'compile', 'autocomplete', 'accomplish']);
  });

});
