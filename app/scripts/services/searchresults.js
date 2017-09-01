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

    var getResults = function(data) {
      var newData = new Object();
      newData.len = 0;
      newData.subs = 0;

      var comments, submissions, count;

      for (var key in data) {
        comments = filterData(data[key], key, 'comments');
        newData[key] = {};
        newData[key].comments = comments;
        newData[key].commentsCount = comments.length;

        submissions = filterData(data[key], key, 'submissions');
        newData[key].submissions = submissions;
        newData[key].submitsCount = submissions.length;

        count = comments.length + submissions.length;

        newData[key].count = count;
        newData.len += count;
        if (count > 0) {
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

        var bodyMatch = false;
        var titleMatch = false;

        if (where === 'comments') {
          body = $filter('escape')(item.body_html);
        } else if (item.selftext_html) {
          body = item.selftext_html;
        }

        if (where === 'comments') {
          title = item.link_title;
        } else {
          title = item.title;
        }

        if (body) {
          bodyMatch = matchText(terms, body);
        }

        if (title) {
          titleMatch = matchText(terms, title);
        }

        /* Reset highlighted html */
        item = resetHighlighted(item);

        if (bodyMatch || titleMatch) {
          var highlighted_body = highlightTerms(terms, body);
          if (highlighted_body) {
            item = replaceBody(highlighted_body, item, where);
          }

          var highlighted_title = highlightTerms(terms, title);
          if (highlighted_title) {
            item = replaceTitle(highlighted_title, item, where);
          }

          if (highlighted_body || highlighted_title) {
            dataList.push(item);
          }
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

    var matchText = function(terms, body) {
      for (var i = 0; i < terms.length; i++) {
        var term = terms[i].toLowerCase();
        if (body.toLowerCase().indexOf(term) < 0) {
          return false;
        }
      }
      return true;
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
      return regexp.exec(text);
    };

    var highlightTerms = function(terms, body) {
      for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        body = $filter('highlight')(body, term);

        if (!body || !(isMatch(body, term))) {
          return null;
        }
      }
      return body;
    };


    // Public API here
    return {
      getData: function(input, data) {
        searchInput = input;
        return getResults(data);
      }
    };
  }]);
