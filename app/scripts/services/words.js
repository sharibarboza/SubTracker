'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.words
 * @description
 * # words
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('words', ['$filter', function ($filter) {
    var sub;
    var currentUser;
    var subWords = {};

    var stopWords = [
      "a",
      "about",
      "above",
      "after",
      "again",
      "against",
      "all",
      "also",
      "am",
      "an",
      "and",
      "any",
      "are",
      "aren't",
      "as",
      "at",
      "be",
      "because",
      "been",
      "before",
      "being",
      "below",
      "between",
      "both",
      "but",
      "by",
      "can",
      "can't",
      "cannot",
      "could",
      "couldn't",
      "could've",
      "did",
      "didn't",
      "do",
      "does",
      "doesn't",
      "doing",
      "don't",
      "down",
      "during",
      "each",
      "even",
      "few",
      "for",
      "from",
      "further",
      "get",
      "had",
      "hadn't",
      "has",
      "hasn't",
      "have",
      "haven't",
      "having",
      "he",
      "he'd",
      "he'll",
      "he's",
      "her",
      "here",
      "here's",
      "hers",
      "herself",
      "him",
      "himself",
      "his",
      "how",
      "how's",
      "i",
      "i'd",
      "i'll",
      "i'm",
      "i've",
      "if",
      "in",
      "into",
      "is",
      "isn't",
      "it",
      "it's",
      "its",
      "itself",
      "just",
      "let's",
      "like",
      "me",
      "more",
      "most",
      "mustn't",
      "my",
      "myself",
      "no",
      "nor",
      "not",
      "of",
      "off",
      "on",
      "once",
      "only",
      "or",
      "other",
      "ought",
      "our",
      "ours",
      "ourselves",
      "out",
      "over",
      "own",
      "really",
      "same",
      "shan't",
      "she",
      "she'd",
      "she'll",
      "she's",
      "should",
      "shouldn't",
      "should've",
      "so",
      "some",
      "such",
      "than",
      "that",
      "that's",
      "the",
      "their",
      "theirs",
      "them",
      "themselves",
      "then",
      "there",
      "there's",
      "these",
      "they",
      "they'd",
      "they'll",
      "they're",
      "they've",
      "think",
      "this",
      "those",
      "through",
      "to",
      "too",
      "under",
      "until",
      "up",
      "very",
      "was",
      "wasn't",
      "we",
      "we'd",
      "we'll",
      "we're",
      "we've",
      "were",
      "weren't",
      "what",
      "what's",
      "when",
      "when's",
      "where",
      "where's",
      "which",
      "while",
      "who",
      "who's",
      "whom",
      "why",
      "why's",
      "will",
      "with",
      "won't",
      "would",
      "wouldn't",
      "would've",
      "you",
      "you'd",
      "you'll",
      "you're",
      "you've",
      "your",
      "yours",
      "yourself",
      "yourselves"
    ];

    /*
     Split comments or submissions for a specific subreddit into words for word cloud
    */
    return {
      getWords: function(currentSub, user, subs) {
        if (currentUser !== user) {
          currentUser = user;
          clear();
        }

        if (Object.keys(subWords).length == 20) {
          clear();
        }

        sub = currentSub;
        if (!(currentSub in subWords)) {
          if (!(sub in subWords)) {
            subWords[sub] = {};
            subWords[sub].wordDict = {};
            subWords[sub].wordArray = [];
          }

          var comments = subs[sub].comments;
          var submissions = subs[sub].submissions;

          splitWords(comments, 'comments');
          splitWords(submissions, 'submits');
          addWordArray(sub);
        }

        return subWords[sub].wordArray;
      },
      clearData: function() {
        clear();
      }
    };

    /*
     Clears data
    */
    function clear() {
      for (var key in subWords) {
        if (subWords.hasOwnProperty(key)) {
          delete subWords[key];
        }
      }
    }

    /*
     Add word array to upvoted or downvoted section of a sub's Words
    */
    function addWordArray(sub) {
      adjustPluralWords();

      for (var key in subWords[sub].wordDict) {
        var wordObj = {};
        wordObj.text = key;
        wordObj.weight = subWords[sub].wordDict[key];
        subWords[sub].wordArray.push(wordObj);
      }
    }

    /*
     Check for pluralized words ending in 's' and combine with singles if necessary
    */
    function adjustPluralWords() {
      var dataDict = subWords[sub].wordDict;

      for (var key in dataDict) {
        if (key.slice(-1) == 's') {
          var singleWord = key.slice(0, key.length-1);

          if (singleWord in dataDict) {
            var singleNum = dataDict[singleWord];
            var pluralNum = dataDict[key];

            if (singleNum >= pluralNum) {
              dataDict[singleWord] += pluralNum;
              delete dataDict[key];
            } else {
              dataDict[key] += singleNum;
              delete dataDict[singleWord];
            }
          }
        }
      }
      subWords[sub].wordDict = dataDict;
    }

    /*
     Iterate through comments or submissions and split each body text
     into separate words
    */
    function splitWords(data, where) {
      for (var i = 0; i < data.length; i++) {
        var post = data[i], body_words, title_words;

        if (where === 'comments') {
          groupWords(post.body_html);
        } else if (where === 'submits') {
          groupWords(post.title);
          if ('selftext' in post && post.selftext) {
            groupWords(post.selftext);
          } else if ('selftext_html' in post && post.selftext_html) {
            groupWords(post.selftext_html);
          }
        }
      }
    }

    /*
     Split body text into array of words and clean words of non-alpha characters
    */
    function groupWords(body) {
      if (body) {
        var words = body.split(' ');

        for (var i = 0; i < words.length; i++) {
          var word = $filter('escape')(words[i]);

          if (isNotLink(word)) {
            var splitWords = cleanWord(word);
            addWords(splitWords);
          }
        }  
      }
    }

    /*
     Checks whether a word is not a link
    */
    function isNotLink(word) {
      return word.indexOf('http') < 0;
    }

    /*
     Keep a count of each word and store in wordDict
    */
    function addWords(words) {
      for (var i = 0; i < words.length; i++) {
        var word = words[i].toLowerCase();

        if (word.length > 0 && filterWord(word)) {
          if (word in subWords[sub].wordDict) {
            subWords[sub].wordDict[word] += 1;
          } else {
            subWords[sub].wordDict[word] = 1;
          }
        }
      }
    }

    /*
     Filter words to be included in the word cloud
     - Words that are too long or short are exluded
     - Words that are classified as a stopword are excluded
     - Words that are anchor links are excluded
    */
    function filterWord(word) {
      if (word[0] == '-' || word[word.length-1] == '-') {
        return false;
      } else if (word[0] == '\'' || word[word.length-1] == '\'') {
        return false;
      } else if (stopWords.indexOf(word) >= 0) {
        return false;
      } else if (word.length > 20 || word.length < 3) {
        return false;
      }
      return true;
    }

    /*
     Remove non-alpha characters from word
    */
    function cleanWord(word) {
      var newWords = [];
      var current = '';

      word = word.replace('\’', "\'");
      var tags = ['div', 'class=', 'blockquote', 'quot', 'href', "\'s"];

      for (var i = 0; i < tags.length; i++) {
        var re = new RegExp(tags[i], 'g');
        word = word.replace(re, '');
      }

      word = word.replace(new RegExp(/.+>/, 'g'), '');
      word = $filter('escape')(word);

      for (var i = 0; i < word.length; i++) {
        var char = word[i];

        if (char.match(/[A-Za-zÀ-ÿ0-9-\']/i)) {
          current += char;
        } else {
          if (current.length > 0) {
            newWords.push(current);
          }
          current = '';
        }
      }
      if (newWords.indexOf(current) < 0 && current.length > 0) {
        newWords.push(current);
      }

      return newWords;
    }

  }]);
