'use strict';

describe('Filter: sortPosts', function () {

  // load the filter's module
  beforeEach(module('SubSnoopApp'));

  // initialize a new instance of the filter before each test
  var sortPostsFilter;
  beforeEach(inject(function (_sortPostsFilter_) {
    sortPostsFilter = _sortPostsFilter_;
  }));

  it('should correctly sort by newest post ', function () {
    var posts = [
      {
        'created_utc' : 1506947458  // October 2, 2017 12:30 PM
      },
      {
        'created_utc' : 1506846658  // October 1, 2017 8:30 AM 
      },
      {
        'created_utc' : 1507030258  // October 3, 2017 11:30 AM
      }
    ];

    var sortedPosts = sortPostsFilter(posts, 'newest');

    expect(sortedPosts[0].created_utc).toBe(1507030258);
    expect(sortedPosts[1].created_utc).toBe(1506947458);
    expect(sortedPosts[2].created_utc).toBe(1506846658);
  });

  it('should correctly sort by oldest post', function() {
    var posts = [
      {
        'created_utc' : 1506947458  // October 2, 2017 12:30 PM
      },
      {
        'created_utc' : 1506846658  // October 1, 2017 8:30 AM 
      },
      {
        'created_utc' : 1507030258  // October 3, 2017 11:30 AM
      }
    ];

    var sortedPosts = sortPostsFilter(posts, 'oldest');

    expect(sortedPosts[0].created_utc).toBe(1506846658);
    expect(sortedPosts[1].created_utc).toBe(1506947458);
    expect(sortedPosts[2].created_utc).toBe(1507030258);
  });

  it('should correctly sort by most points', function() {
    var posts = [
      {
        'ups' : -50
      },
      {
        'ups' : 0
      },
      {
        'ups' : 520
      }
    ];

    var sortedPosts = sortPostsFilter(posts, 'mostUps');

    expect(sortedPosts[0].ups).toBe(520);
    expect(sortedPosts[1].ups).toBe(0);
    expect(sortedPosts[2].ups).toBe(-50);
  });

  it('should correctly sort by least points', function() {
    var posts = [
      {
        'ups' : -50
      },
      {
        'ups' : 0
      },
      {
        'ups' : 520
      }
    ];  
    
    var sortedPosts = sortPostsFilter(posts, 'mostDowns');

    expect(sortedPosts[0].ups).toBe(-50);
    expect(sortedPosts[1].ups).toBe(0);
    expect(sortedPosts[2].ups).toBe(520); 
  })

});
