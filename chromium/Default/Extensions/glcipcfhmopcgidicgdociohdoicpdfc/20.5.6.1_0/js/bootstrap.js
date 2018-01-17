(function () {
  var params = {};
  var isLite = window.localStorage.getItem('lite') === 'true';
  var isSwitchedToHalfView = window.muzli.isSafari ? true : window.localStorage.getItem('halfView') === 'true';

  function setParams() {
    window.location.hash.substr(1).split('&').forEach(function (item) {
      if (item) {
        var param = item.split('=');
        if (param[0] && param[1]) {
          params[param[0]] = param[1];
        }
      }
    });
  }

  function goToChromeSearch() {
    window.chrome.tabs.getCurrent(function (tab) {
      window.chrome.tabs.update(tab.id, {
        "url": "chrome-search://local-ntp/local-ntp.html"
      });
    });

    window.stop();
  }

  function updateQuickAccess() {

    if (isSwitchedToHalfView) {
      var head = document.head,
        link = document.createElement('style');

      link.innerHTML = '#quickAccess { display: block !important;  -webkit-transition: none !important; } #quickAccess .input { display :none }';

      head.appendChild(link);
    }
  }

  function checkLogin() {
    if (params.token) {
      if (window.chrome && window.chrome.storage) {
        window.chrome.storage.local.remove("user");
      }
      else {
        window.localStorage.removeItem("user");
      }

      window.localStorage.token = params.token;
      if (params.favorite) {
        window.REGISTERED = 'favorite';
      }
      else if (params.sources) {
        window.REGISTERED = 'sources';
      }
      else if (params.sourceFeedPromo) {
        window.REGISTERED = 'sourceFeedPromo';
      }
      else {
        window.REGISTERED = 'login';
      }
      window.location.hash = '';
      return true;
    }
  }

  function checkTwitter() {
    if (params.twitter) {
      window.localStorage.social_handler = params.twitter;
      window.location.hash = '';
      return true;
    }
  }

  function checkLite() {
    if (window.location.search === '?button') {
      return;
    }

    if (window.chrome && isLite) {
      goToChromeSearch();
    }

  }

  setParams();
  updateQuickAccess();


  if (checkTwitter()) {
    return;
  }

  if (checkLogin()) {
    return;
  }

  checkLite();

})();
