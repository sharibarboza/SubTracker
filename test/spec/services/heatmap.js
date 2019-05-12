'use strict';

describe('test heatmap service', function () {

  // load the service's module
  beforeEach(module('SubSnoopApp'));

  // instantiate service
  var currentYear, subHeatmap, userHeatmap, moment, sub1Data, sub2Data, subs;
  beforeEach(inject(function (_subHeatmap_, _userHeatmap_, _moment_) {
    subHeatmap = _subHeatmap_;
    userHeatmap = _userHeatmap_;
    moment = _moment_;

    currentYear = moment().year();

    var sub1 = 'gaming';
    var sub2 = 'politics';

    sub1Data = {
      'comments': [
        {'created_utc': moment().subtract(5, 'day').subtract(1, 'hour').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(5, 'day').subtract(2, 'hour').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(3, 'day').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(1, 'day').unix(), 'subreddit' : sub1 }
      ],
      'submissions': [
        {'created_utc': moment().subtract(5, 'day').subtract(1, 'hour').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(5, 'day').subtract(2, 'hour').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(2, 'day').unix(), 'subreddit' : sub1 },
        {'created_utc': moment().subtract(4, 'day').unix(), 'subreddit' : sub1 }
      ]
    };

    sub2Data = {
      'comments': [
        {'created_utc': moment().subtract(5, 'day').unix(), 'subreddit' : sub2 } // October 1, 2017 6:45 AM
      ],
      'submissions': []
    }

    subs = {
      sub1 : sub1Data,
      sub2 : sub2Data
    }
  }));

  it('should return proper data for sub maps', function() {
    var result = subHeatmap.getSubMap('user1', 'gaming', sub1Data, currentYear);
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
    var result = userHeatmap.getUserMap('user1', subs, currentYear);
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
