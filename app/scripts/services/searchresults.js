'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.searchResults
 * @description
 * # searchResults
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .factory('searchResults', ['$filter', function ($filter) {
    var searchInput = "";
    var newData = new Object();

    /*
     User interface for search results factory
    */
    var factory = {
      getData: function(input, data) {
        searchInput = input;
        return getResults(data);
      },
      getResults: function() {
        return newData;
      },
      resetData: function() {
        newData = new Object();
        newData.data = {};
      }
    };
    return factory;

    /*
     Gets the user input terms and processes the search results
    */
    function getResults(data) {
      newData = new Object();
      newData.data = {};

      for (var key in data) {
        var resultSub = {}, comments, submissions, count = 0;

        /* Add comments data */
        comments = filterData(data[key], key, 'comments');
        resultSub.comments = comments;
        resultSub.numComments = comments.length;

        /* Add submissions data */
        submissions = filterData(data[key], key, 'submissions');
        resultSub.submissions = submissions;
        resultSub.numSubmissions = submissions.length;

        if (comments.length + submissions.length) {
          newData.data[key] = resultSub;
        }
      }
      return newData;

    };

    /*
     Combines the process of searching for matching terms in posts while
     also highlighting them.
    */
    function filterData(data, sub, where) {
      var dataList = [];

      for (var i = 0; i < data[where].length; i++) {
        var item = data[where][i];
        var body = null;
        var title = null;
        var terms = searchInput.split(' ');

        var highlighted_title = null;

        if (where === 'comments') {
          body = $filter('escape')(item.body_html);
          title = item.link_title;
        } else if (item.selftext_html) {
          body = item.selftext_html;
        }

        if (where === 'submissions') {
          title = item.title;
        }

        /* Reset highlighted html */
        item = resetHighlighted(item);
        var match = highlightTerms(terms, body, title, where);

        if (match) {

          /*
           If the post finds match that must be highlighted, store the wrapped
           HTML text in the item object
          */
          if ('body' in match) {
            item = replaceBody(match.body, item, where);
          }

          if ('title' in match) {
            item = replaceTitle(match.title, item, where);
          }

          // Add item to the results array
          dataList.push(item);
        }

      }

      return $filter('sortPosts')(dataList, 'newest');
    };

    /*
     Reset all highlighted data entries for a new search
    */
    function resetHighlighted(item) {
      if ('highlighted_body' in item) {
        item.highlighted_body = null;
      }

      if ('highlighted_title' in item) {
        item.highlighted_title = null;
      }
      return item;
    };

    /*
     Store HTML post body text with highlighted terms
    */
    function replaceBody(text, item, where) {
      item.highlighted_body = text;
      return item;
    }

    /*
     Store HTML title text with highlighted terms.
     Used for submission titles only, not comments.
    */
    function replaceTitle(text, item, where) {
      item.highlighted_title = text;
      return item;
    }

    /*
     Filtering method, used to confirm if the text has any terms that are
     indeed highlighted.
    */
    function isMatch(text, term) {
      var regexp = new RegExp('<span class="highlight">'+ term +'</span>', 'gi');
      return regexp.exec(text.toLowerCase());
    };

    /*
     Keeps track and confirms that all terms are matched in the given text.
     For comments, multi-word input must be matched for all terms.
     For submissions, the matches can be spread out between the body and the title texts.
     For example, in a search input with 2 words, the submission post is a match if one word
     only is found in the body but the other word is found in the title.
    */
    function highlightTerms(terms, body, title, where) {
      var matched_terms = [];

      // Check post body text for any matches
      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        body = $filter('highlight')(body, term);

        if (body && isMatch(body, term)) {
          matched_terms.push(term);
        }
      }

      // Check submission title only for any matches
      if (where === 'submissions') {
        for (var i = 0; i < terms.length; i++) {
          var term = terms[i];
          title = $filter('highlight')(title, term);
          if (title && isMatch(title, term)) {
            matched_terms.push(term);
          }
        }
      }

      // Check that all terms are matched
      for (var i = 0; i < terms.length; i++) {
        if (matched_terms.indexOf(terms[i]) < 0) {
          return null;
        }
      }

      /*
       body and title params are each the modified HTML text containing
       the classes to highlight the matched terms.
      */
      if (where === 'comments') {
        return {'body': body};
      } else {
        return {'body': body, 'title': title};
      }
    };

  }]);
