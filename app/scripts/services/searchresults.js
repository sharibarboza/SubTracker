'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.searchResults
 * @description
 * # searchResults
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('searchResults', ['$filter', function ($filter) {
    var searchInput = "";
    var postType = 1;
    var filterSubs = null;

    var getResults = function(data) {
      var newData = new Object();
      newData.data = {};
      newData.comments = 0;
      newData.submissions = 0;
      newData.len = 0;
      newData.subs = 0;
      var comments = [], submissions = [], count;

      for (var key in data) {
        var resultSub = {}, commentLen, submitLen;

        resultSub.count = 0;
        resultSub.commentsCount = 0;
        resultSub.submitsCount = 0;

        if (postType != 3) {
          comments = filterData(data[key], key, 'comments');
          resultSub.comments = comments;
          commentLen = comments.length;
          resultSub.commentsCount = commentLen;
          newData.comments += commentLen;
        }

        if (postType != 2) {
          submissions = filterData(data[key], key, 'submissions');
          resultSub.submissions = submissions;
          submitLen = submissions.length;
          resultSub.submitsCount = submitLen;
          newData.submissions += submitLen;
        }

        resultSub.count = comments.length + submissions.length;
        if (resultSub.count > 0) {
          newData.data[key] = resultSub;
          newData.len += resultSub.count;
          newData.subs += 1;
        }
      }
      return newData;

    };

    var filterData = function(data, sub, where) {
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
          if ('body' in match) {
            item = replaceBody(match.body, item, where);
          }

          if ('title' in match) {
            item = replaceTitle(match.title, item, where);
          }
          dataList.push(item);
        }

      }

      return dataList;
    };

    var resetHighlighted = function(item) {
      if ('highlighted_body' in item) {
        item.highlighted_body = null;
      }

      if ('highlighted_title' in item) {
        item.highlighted_title = null;
      }
      return item;
    };

    var replaceBody = function(text, item, where) {
      item.highlighted_body = text;
      return item;
    }

    var replaceTitle = function(text, item, where) {
      item.highlighted_title = text;
      return item;
    }

    var isMatch = function(text, term) {
      var regexp = new RegExp('<span class="highlight">'+ term +'</span>', 'gi');
      return regexp.exec(text.toLowerCase());
    };

    var highlightTerms = function(terms, body, title, where) {
      var matched_terms = [];

      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        body = $filter('highlight')(body, term);

        if (body && isMatch(body, term)) {
          matched_terms.push(term);
        }
      }

      if (where === 'submissions') {
        for (var i = 0; i < terms.length; i++) {
          var term = terms[i];
          title = $filter('highlight')(title, term);
          if (title && isMatch(title, term)) {
            matched_terms.push(term);
          }
        }
      }

      for (var i = 0; i < terms.length; i++) {
        if (matched_terms.indexOf(terms[i]) < 0) {
          return null;
        }
      }

      if (where === 'comments') {
        return {'body': body};
      } else {
        return {'body': body, 'title': title};
      }
    };


    // Public API here
    return {
      getData: function(input, data, type, subs) {
        searchInput = input;
        postType = type;
        filterSubs = subs;
        return getResults(data);
      }
    };
  }]);
