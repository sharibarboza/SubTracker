'use strict';

/**
 * @ngdoc service
 * @name SubSnoopApp.search
 * @description
 * # search
 * Service in the SubSnoopApp.
 */
angular.module('SubSnoopApp')
  .service('search', function () {

    /*
     Matches term with the searchlist and returns the filtered array
    */
    return {
      findSubs: function(searchList, term) {
        var dataList = [];
        for (var i = 0; i < searchList.length; i++) {
          var key = searchList[i];
          if (key.toLowerCase().indexOf(term.toLowerCase()) >= 0) {
            dataList.push(key);
          }
        }
        return dataList;
      }
    }
  });
