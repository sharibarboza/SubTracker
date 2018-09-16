'use strict';

describe('Filter: sortSubs', function () {

  // load the filter's module
  beforeEach(module('SubSnoopApp'));

  // initialize a new instance of the filter before each test
  var sortSubsFilter;
  var subData;
  var subKeys;

  /*
  beforeEach(inject(function (_sortSubsFilter_) {
    sortSubsFilter = _sortSubsFilter_;

    subData = {
      'politics' : {
        'comments' : [
          {}, {}, {}
        ],
        'submissions' : [],
        'total_ups' : 10,
        'recent_activity' : {
          'created_utc' : 1506947458  // October 2, 2017 12:30 PM
        },
        'comment_ups' : 4,
        'submission_ups' : 6,
        'count' : 3
      },
      'gaming' : {
        'comments' : [],
        'submissions' : [
          {}, {}
        ],
        'total_ups' : 8,
        'recent_activity' : {
          'created_utc' : 1506846658  // October 1, 2017 8:30 AM
        },
        'comment_ups' : 0,
        'submission_ups' : 8,
        'count' : 2
      },
      'pics' : {
        'comments' : [
          {}
        ],
        'submissions' : [],
        'total_ups' : -10,
        'recent_activity' : {
          'created_utc' : 1507030258  // October 3, 2017 11:30 AM
        },
        'comment_ups' : -10,
        'submission_ups' : 0,
        'count' : 1
      }
    };

    subKeys = Object.keys(subData);
  }));

  it('should correctly sort by sub name', function () {
    var sortedSubs = sortSubsFilter(subKeys, 'subName', subData);

    expect(sortedSubs[0]).toBe('gaming');
    expect(sortedSubs[1]).toBe('pics');
    expect(sortedSubs[2]).toBe('politics');
  });

  it('should correctly sort by total comments', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'totalComments', subData);

    expect(sortedSubs[0]).toBe('politics');
    expect(sortedSubs[1]).toBe('pics');
    expect(sortedSubs[2]).toBe('gaming');
  });

  it('should correctly sort by total submissions', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'totalSubmits', subData);

    expect(sortedSubs[0]).toBe('gaming');
    expect(sortedSubs[1]).toBe('pics');
    expect(sortedSubs[2]).toBe('politics');
  });

  it('should correctly sort by total upvotes', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'totalUps', subData);

    expect(sortedSubs[0]).toBe('politics');
    expect(sortedSubs[1]).toBe('gaming');
    expect(sortedSubs[2]).toBe('pics');
  });

  it('should correctly sort by least upvotes', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'mostDown', subData); 
     
    expect(sortedSubs[0]).toBe('pics');
    expect(sortedSubs[1]).toBe('gaming');
    expect(sortedSubs[2]).toBe('politics');  
  });

  it('should correctly sort by most recent activity', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'lastSeen', subData); 
     
    expect(sortedSubs[0]).toBe('pics');
    expect(sortedSubs[1]).toBe('politics');
    expect(sortedSubs[2]).toBe('gaming');  
  });

  it('should correctly sort by most active', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'mostActive', subData); 
     
    expect(sortedSubs[0]).toBe('politics');
    expect(sortedSubs[1]).toBe('gaming');
    expect(sortedSubs[2]).toBe('pics');  
  });

  it('should correctly sort by best comment average', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'avgComment', subData); 
     
    expect(sortedSubs[0]).toBe('politics');
    expect(sortedSubs[1]).toBe('gaming');
    expect(sortedSubs[2]).toBe('pics');  
  });

  it('should correctly sort by best submit average', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'avgSubmit', subData); 
     
    expect(sortedSubs[0]).toBe('gaming');
    expect(sortedSubs[1]).toBe('pics');
    expect(sortedSubs[2]).toBe('politics');     
  });

  it('should correctly sort by best post average', function() {
    var sortedSubs = sortSubsFilter(subKeys, 'avgPost', subData); 
     
    expect(sortedSubs[0]).toBe('gaming');
    expect(sortedSubs[1]).toBe('politics');
    expect(sortedSubs[2]).toBe('pics'); 
  });
  */

});
