'use strict';

describe('test heatmap service', function () {

  // load the service's module
  beforeEach(module('SubSnoopApp'));

  // instantiate service
  var subHeatmap, userHeatmap, moment, sub1Data, sub2Data, subs;
  beforeEach(inject(function (_subHeatmap_, _userHeatmap_, _moment_) {
    subHeatmap = _subHeatmap_;
    userHeatmap = _userHeatmap_;
    moment = _moment_;

    var sub1 = 'gaming';
    var sub2 = 'politics';

    sub1Data = {
      'comments': [
        {'created_utc': 1506846658, 'subreddit' : sub1 }, // October 1, 2017 8:30 AM
        {'created_utc': 1506853858, 'subreddit' : sub1 }, // October 1, 2017 10:30 AM
        {'created_utc': 1506947458, 'subreddit' : sub1 }, // October 2, 2017 12:30 PM
        {'created_utc': 1507192258, 'subreddit' : sub1 }   // October 5, 2017 8:30 AM
      ],
      'submissions': [
        {'created_utc': 1506861058, 'subreddit' : sub1 },  // October 1, 2017 12:30 PM
        {'created_utc': 1506857458, 'subreddit' : sub1 },  // October 1, 2017 11:30 AM
        {'created_utc': 1507030258, 'subreddit' : sub1 },  // October 3, 2017 11:30 AM
        {'created_utc': 1507102258, 'subreddit' : sub1 }  // October 4, 2017 7:30 AM
      ]
    };

    sub2Data = {
      'comments': [
        {'created_utc': 1506840300, 'subreddit' : sub2 } // October 1, 2017 6:45 AM
      ],
      'submissions': []
    }

    subs = {
      sub1 : sub1Data,
      sub2 : sub2Data
    }
  }));

  it('should return proper data for sub maps', function() {
    var result = subHeatmap.getSubMap('user1', 'gaming', sub1Data, 2017, false);
    expect(result.length).toEqual(5);

    for (var key in result) {
      var obj = result[key];
      if (obj.date === '2017-10-01') {
        expect(obj.comments).toEqual(2);
        expect(obj.submissions).toEqual(2);
      } else if (obj.date === '2017-10-02') {
        expect(obj.comments).toEqual(1);
        expect(obj.submissions).toEqual(0);
      } else if (obj.date === '2017-10-03') {
        expect(obj.comments).toEqual(0);
        expect(obj.submissions).toEqual(1);
      } else if (obj.date === '2017-10-04') {
        expect(obj.comments).toEqual(0);
        expect(obj.submissions).toEqual(1);
      } else if (obj.date === '2017-10-05') {
        expect(obj.comments).toEqual(1);
        expect(obj.submissions).toEqual(0);
      }
    }
  });

  it('should return proper data for user maps', function() {
    var result = userHeatmap.getUserMap('user1', subs, 2017, false);
    expect(result.length).toEqual(5);

    for (var key in result) {
      var obj = result[key];
      if (obj.date === '2017-10-01') {
        expect(obj.total).toEqual(5);
        expect(obj.subs['gaming'].comments).toBe(2);
        expect(obj.subs['gaming'].submissions).toBe(2);
        expect(obj.subs['politics'].comments).toBe(1);
        expect(obj.subs['politics'].submissions).toBe(0);
      } else if (obj.date === '2017-10-02') {
        expect(obj.total).toEqual(1);
        expect(obj.subs['gaming'].comments).toBe(1);
        expect(obj.subs['gaming'].submissions).toBe(0);
        expect('politics' in obj.subs).toBeFalsy();
      } else if (obj.date === '2017-10-03') {
        expect(obj.total).toEqual(1);
        expect(obj.subs['gaming'].comments).toBe(0);
        expect(obj.subs['gaming'].submissions).toBe(1);
        expect('politics' in obj.subs).toBeFalsy();
      } else if (obj.date === '2017-10-04') {
        expect(obj.total).toEqual(1);
        expect(obj.subs['gaming'].comments).toBe(0);
        expect(obj.subs['gaming'].submissions).toBe(1);
        expect('politics' in obj.subs).toBeFalsy();
      } else if (obj.date === '2017-10-05') {
        expect(obj.total).toEqual(1);
        expect(obj.subs['gaming'].comments).toBe(1);
        expect(obj.subs['gaming'].submissions).toBe(0);
        expect('politics' in obj.subs).toBeFalsy();
      }
    }
  });


});
