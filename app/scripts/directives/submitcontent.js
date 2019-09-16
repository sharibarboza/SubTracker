'use strict';

/**
 * @ngdoc directive
 * @name SubSnoopApp.directive:submitContent
 * @description
 * # submitContent
 */
angular.module('SubSnoopApp')
  .directive('submitContent', ['$compile', '$filter', '$window', 'submissions', function ($compile, $filter, $window, submissions) {

    var windowWidth = $window.innerWidth;
    var defaultVideo = 100;

    /*
     Submission posts with no preview images
    */
    var isLinkedImage = function(submit) {
      return isImage(submit) && !submit.preview;
    };

    /*
     Submissions posts with a preview image and a link
    */
    var isAttachedImage = function(submit) {
      return isImage(submit) && submit.preview;
    };

    /*
     Check if submission is an image
     */
    var isImage = function(submit) {
      return !submit.selftext_html && !submit.media && hasImgFormat(submit.url);
    };

    /*
     Check if image has .png or .jpg/jpeg format
     */
    var hasImgFormat = function(url) {
        var formats = ['.png', '.jpg', '.jpeg'];
        for (var i = 0; i < formats.length; i++) {
            if (url.indexOf(formats[i]) >= 0) {
                return true;
            }
        }
        return false;
    };

    /*
     Check if image is a gif
     */
    var isGif = function(url) {
        return url.indexOf('.gif') >= 0;
    };

    /*
     Check if submission is an mp4 video
     */
    var isMP4 = function(url) {
        return url.indexOf('.mp4') >= 0;
    };

    /*
     Check if image is a gif from Imgur
     */
    var isImgurGif = function(url) {
        return isGif(url) && url.indexOf('imgur') >= 0;
    };

    /*
     Strip the .gif format from the Imgur url
     */
    var getImgurUrl = function(url) {
        var gif_i = url.indexOf('.gif');
        return url.slice(0, gif_i);
    };

    /*
     Check if submission belongs to an Imgur album
     */
    var isImgurAlbum = function(submit) {
      return submit.media && submit.media.oembed && submit.media.oembed.provider_name === "Imgur";
    };

    /*
     Check if submission has the .gifv format
     */
    var isVideo = function(url) {
      if (url) {
        return url.indexOf('gifv') >= 0;
      } else {
        return false;
      }
    };

    /*
     Submitted videos will usually be of .gifv format.
     Stripping and using .gif instead will make the video animated.
    */
    var getVideoUrl = function(url) {
      if (isVideo(url)) {
        return url.slice(0, url.length-1);
      } else {
        return url;
      }
    };

    /*
     Change width of embedded videos
    */
    var changeSize = function(page, html) {
      var videoWidth = defaultVideo;

      if (page === 'submissions' && windowWidth > 800) {
        videoWidth = 70;
      }

      html = html.replace(/width="\d+"/g, 'width="' + videoWidth + '%"');

      var videoHeight = 300;
      html = html.replace(/height="\d+"/g, 'height="' + videoHeight + '"');

      return html;
    };

    /*
     Highlight search terms in text posts for the search page
    */
    var highlightHtml = function(page, html, data, truncate) {
      var text;

      if (page === 'search' && data.highlighted_body) {
        text = $filter('sanitize')(data.highlighted_body);
      } else {
        text = $filter('sanitize')(html);
      }

      text = $filter('escape')(text);
      return truncateText(text, truncate);
    };

    /*
     Check if submision content has preview images
    */
    var isPreview = function(data) {
      if (data.preview) {
        var resolutions = data.preview;
        var index = 3;

        if (resolutions.length <= 3) {
          index = resolutions.length-1;
        }

        if (resolutions[index] && 'url' in resolutions[index]) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    /*
     Get the preview image with medium-size resolution
    */
    var getPreview = function(data) {
      var resolutions = data.preview;
      var index = 3;

      if (resolutions.length <= 3) {
        index = resolutions.length-1;
      }
      return resolutions[index].url;
    }

    /*
     Make URLs in html secure by adding s to http
    */
    var secureURLs = function(html) {
      if (html.indexOf('https') < 0) {
        return html.replace('http', 'https');
      }
      return html;
    }

    /*
     Alter the width of an image
    */
    var getImageClass = function(page) {
      return '<img class="submit-pic fuller-pic" ';
    }

    /*
     Truncate text posts
    */
    var truncateText = function(html, truncate) {
      if (truncate == "true") {
        return $filter('truncate')(html, 200, false);
      } else {
        return html;
      }
    }

    /*
     Align content in the center
    */
    var centerWrap = function(html) {
      return '<div align="center">' + html + '</div>';
    }

    /*
     Sets up and cleans data for displaying submission content.
     Deals with displaying:
      - Sanitized HTML text posts
      - Attached images, linked images, static/animated gifs
      - Embedded HTML, usually for videos and image albums (imgur)
    */
    return {
      restrict: 'E',
      scope: {
          data: '@',
          page: '@',
          truncate: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('data', function() {
          var data = JSON.parse(attrs.data);
          var page = attrs.page;
          var truncate = attrs.truncate;

          var getTemplate = function(data, truncate) {
            var content;
            var submitID = data.id;

            if (page !== 'search' && submissions.isStored(submitID, attrs.user)) {
                content = submissions.getContent(submitID);
                return secureURLs(content);
            }

            if (isLinkedImage(data)) {
              content = getImageClass(page) + 'lazy-img="' + getVideoUrl(data.url) + '">';
            } else if (data.media && data.media.oembed && data.media.oembed.provider_name != "Imgur") {
              var html = $filter('escape')(secureURLs(data.media.oembed.html));
              content = centerWrap(changeSize(page, html));
            } else if (isPreview(data) && (isAttachedImage(data) || isImgurAlbum(data))) {
              content = getImageClass(page) + 'lazy-img="' + $filter('escape')(getPreview(data)) + '">';
            } else if (data.media && 'reddit_video' in data.media && data.media.reddit_video.fallback_url) {
              var html = '<video width="100%" class="submit-pic" controls><source src="' + data.media.reddit_video.fallback_url + '" type="video/mp4"></video>';
              content = centerWrap(changeSize(page, html));
            } else if (isMP4(data.url)) {
              var html = '<video width="100%" class="submit-pic" controls><source src="' + data.url + '" type="video/mp4"></video>';
              content = centerWrap(changeSize(page, html));
            } else if (isGif(data.url)) {
                var gif_url;
                var html;
                if (isImgurGif(data.url)) {
                    gif_url = getImgurUrl(data.url);
                    html = '<img src="' + gif_url + '/embed"></iframe>';
                } else {
                    gif_url = data.url;
                    html = '<img src="' + gif_url + '"></iframe>';
                }
                content = centerWrap(changeSize(page, html));
            } else if (data.selftext_html) {
              content = highlightHtml(page, data.selftext_html, data, truncate);
            } else if (data.html) {
              content = highlightHtml(page, data.html, data, truncate);
            } else {
              content = '<a href="' + data.url + '" target="_blank">' + data.url + '</a>';
            }

            if (page !== 'search') {
              submissions.setContent(submitID, content, attrs.user);
            }

            return secureURLs(content);
          };

          element.html(getTemplate(data, truncate));
          $compile(element.contents())(scope);
        });
      }
    };
  }]);
