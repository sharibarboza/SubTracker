'use strict';

describe('test filterposts service', function () {

  // load the service's module
  beforeEach(module('SubSnoopApp'));

  // instantiate service
  var filterPosts, data;
  beforeEach(inject(function (_filterPosts_, _moment_) {
    filterPosts = _filterPosts_;
    moment = _moment_;

    data = [
      { created_utc: moment().subtract(30, 'minutes').unix() },
      { created_utc: moment().subtract(2, 'hour').unix() },
      { created_utc: moment().subtract(2, 'day').unix() },
      { created_utc: moment().subtract(6, 'day').unix() },
      { created_utc: moment().subtract(20, 'day').unix() },
      { created_utc: moment().subtract(3, 'month').unix() },
      { created_utc: moment().subtract(2, 'year').unix() }
    ];
  }));

  it('should get default filter', function() {
    expect(filterPosts.getDefaultFilter().value).toEqual('all');
  });

  it('should set current filter', function() {
    var filter = {value: 'day', name: 'Last Day'};
    filterPosts.setFilter(filter);
    expect(filterPosts.getFilter().value).toEqual('day');
  });

  it('should filter data by last hour', function() {
    var posts = filterPosts.getData('hour', data);
    expect(posts.length).toEqual(1);
  });

  it('should filter data by last day', function() {
    var posts = filterPosts.getData('day', data);
    expect(posts.length).toEqual(2);
  });

  it('should filter data by last week', function() {
    var posts = filterPosts.getData('week', data);
    expect(posts.length).toEqual(4);
  });

  it('should filter data by last month', function() {
    var posts = filterPosts.getData('month', data);
    expect(posts.length).toEqual(5);
  });

  it('should filter data by last year', function() {
    var posts = filterPosts.getData('year', data);
    expect(posts.length).toEqual(6);
  });

  it('should filter data by all time', function() {
    var posts = filterPosts.getData('all', data);
    expect(posts.length).toEqual(7);
  });

});
