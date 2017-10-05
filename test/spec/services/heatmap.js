'use strict';

describe('test heatmap service', function () {

  // load the service's module
  beforeEach(module('SubSnoopApp'));

  // instantiate service
  var heatmap, moment, subData;
  beforeEach(inject(function (_heatmap_, _moment_) {
    heatmap = _heatmap_;
    moment = _moment_;

    subData = {
      'comments': [
        {'created_utc': 1506846658 }, // October 1, 2017 8:30 AM
        {'created_utc': 1506853858 }, // October 1, 2017 10:30 AM
        {'created_utc': 1506947458 }, // October 2, 2017 12:30 PM
        {'created_utc': 1507192258}   // October 5, 2017 8:30 AM
      ],
      'submissions': [
        {'created_utc': 1506861058},  // October 1, 2017 12:30 PM
        {'created_utc': 1506857458},  // October 1, 2017 11:30 AM
        {'created_utc': 1507030258},  // October 3, 2017 11:30 AM
        {'created_utc': 1507102258},  // October 4, 2017 7:30 AM
      ]
    };
  }));

  it('should return proper length', function() {
    var result = heatmap.getMap(subData);
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
  

});
