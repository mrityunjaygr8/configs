(function () {

  searchService.$inject = ['server', '$http', 'feedFetcher'];
  function searchService(server, $http, feedFetcher) {

    return {
      fetch: fetch
    };

    function fetch(q, sources) {
      var url = server + '/search?q=' + encodeURIComponent(q);
      
      if (sources && sources.length) {
        url += ('&sources=' + sources.join());
      }

      return $http({
        method: 'GET',
        url: url 
      }).then(function (res) {
        return feedFetcher.transformFetch(res.data.feed, res.data.viralityMedian, res.data.proxy_server);
      });
    }
  }

  angular.module('user')
    .factory('searchService', searchService);
})();


