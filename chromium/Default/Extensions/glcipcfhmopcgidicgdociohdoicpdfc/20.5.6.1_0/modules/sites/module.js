(function () {

  run.$inject = ['$q', '$rootScope', 'sites', 'trackService'];
  function run($q, $rootScope, sites, trackService) {

    var defer;
    var eventCategory = 'Settings menu';

    $rootScope.authRecentSitesAction = function (enable) {
      var eventLabel = enable ? 'enable': 'disable';

      if (enable) {
        sites.reqAuthRecent().then(defer.resolve);
      }
      else {
        sites.rejectAuthRecent();
        $rootScope.showEnableAuthRecentSites = false;
        $rootScope.recentSites = null;
        setUpDefer();
      }

      trackService.track({
        category: eventCategory,
        action: 'Click',
        label: eventLabel
      });
    };

    function setUpDefer() {
      defer = $q.defer();

      defer.promise.then(sites.fetchRecent).then(function (data) {

        var hasError = false;
        var count = data.length;
        function completeImageLoad() {
          if (hasError && count === 0) {
            $rootScope.$digest();
          }
        }

        $rootScope.recentSites = data.map(function (item) {
          var cleanUrl = item.url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/)[0];
          var imgUrl;

          var url = item.url;
          var isLocalHost = cleanUrl.indexOf("localhost") === 0 || cleanUrl.indexOf("127.0.0.1") === 0;
          var isFile = cleanUrl.indexOf("file:") === 0;

          if (isLocalHost) {
            imgUrl = "images/icon_localhost.png";
          }
          else if (isFile) {
            imgUrl = "images/local_icon.png";
          }
          else {
            imgUrl = "https://logo.clearbit.com/" + cleanUrl;
          }

          var res = {
            cleanUrl: cleanUrl,
            url: url,
            imgUrl: imgUrl
          };

          if (!isLocalHost && !isFile) {
            var img = new Image();

            img.src = imgUrl;

            $(img).on("load", function () {
              count--;
              completeImageLoad();
            });

            $(img).on("error", function () {
              count--;
              hasError = true;
              var split = cleanUrl.split(':');
              res.error = true;
              res.imgUrl = "http://www.google.com/s2/favicons?domain=" + (split.length > 1 ? split.slice(0, split.length - 1).join('') : split[0]);
              completeImageLoad();
            });
          }
          return res;
        });
      }).finally(function () {
        $rootScope.showEnableAuthRecentSites = false;
      });
    }

    function loadSites() {
      setUpDefer();

      sites.authRecent()
        .then(defer.resolve)
        .catch(function (rejection) {
          if (rejection && rejection.status) {
            $rootScope.hideEnableAuthRecentSitesSetting = true;
            $rootScope.showEnableAuthRecentSites = false;
            return;
          }
          var isChrome = rejection === 'not_chrome';
          if (isChrome) {
            $rootScope.hideEnableAuthRecentSitesSetting = true;
          }
          $rootScope.showEnableAuthRecentSites = rejection !== 'rejected' && !isChrome;
          if (!$rootScope.showEnableAuthRecentSites) {
            $rootScope.recentSites = null;
          }
        });
    }

    loadSites();
    $rootScope.$on('muzliLoadSites', loadSites);

  }

  angular.module('sites', [])
    .run(run);
})();
