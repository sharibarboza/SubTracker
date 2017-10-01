"use strict";

describe("test words factory", function () {
  var words;

  beforeEach(module("SubSnoopApp"));

  beforeEach(inject(function (_words_) {
    words = _words_;
  }));
  /*
  it("should return correct word array", function () {
    var comment1 = {
      body: 'You have never been put to a test till now, that deserved to be called a test.'
    };

    var comment2 = {
      body: 'They will test our courage, our devotion to duty, and our concept of liberty.'
    };

    var comment3 = {
      body: 'It is a test of our courage — of our resolve — of our wisdom — our essential democracy.'
    };

    var submit1 = {
      title: 'The Golden Gate Bridge opening to the public for the first time back in 1937, and yes, it almost collapsed.'
    };

    var submit2 = {
      title: 'Why are there so many places named Guinea or similar names?',
      selftext: 'I.e., Guinea, Guinea-Bissau, Equatorial Guinea, New Guinea (and maybe Guyana if that has a similar word origin?)'
    };

    var dataObj = {
      comments: [comment1, comment2, comment3],
      submissions: [submit1, submit2]
    }

    var result = words.getWords(dataObj, 'history');

    var expectedWords = [
      'never', 
      'put', 
      'test', 
      'till', 
      'now',
      'deserved',
      'called',
      'will',
      'courage',
      'resolve',
      'widsom',
      'essential',
      'democracy',
      'golden',
      'gate',
      'bridge',
      'opening',
      'public',
      'first',
      'time',
      'back',
      '1937',
      'yes',
      'almost',
      'collapsed',
      'many',
      'places',
      'named',
      'guinea',
      'similar',
      'names',
      'bissau',
      'equatorial',
      'new',
      'maybe',
      'guyana',
      'similar',
      'word',
      'origin'
    ]

    for (var i = 0; i < result.length; i++) {
      var word = result[i].text;
      console.log(word);
    }
  });
  */

});

