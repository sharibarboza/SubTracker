'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.d3Service
 * @description
 * # d3Service
 * Factory in the SubSnoopApp.
 */
angular.module('SubSnoopApp')

  /*
   Taken from http://www.ng-newsletter.com/posts/d3-on-angular.html
  */
  .factory('d3Service', ['$document', '$q', '$rootScope', '$http', '$sce',
    function($document, $q, $rootScope, $http, $sce) {
      var d = $q.defer();
      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }

      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.async = true;
      scriptTag.src = 'https://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;

      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);

      return {
        d3: function() { return d.promise; }
      };
  }]);
