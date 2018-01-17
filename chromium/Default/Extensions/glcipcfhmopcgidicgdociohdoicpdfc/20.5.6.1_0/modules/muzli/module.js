document.body.style.display = '';
if (window.chrome && window.chrome.browserAction) {
  window.chrome.browserAction.setBadgeText({"text": ""})
}
var OA_output = [];

// Google Analytics
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

(function () {

  var details = window.muzli.getDetails();

  ga('create', window.GA_TRACKING_CODE, 'auto');

  // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
  ga('set', 'checkProtocolTask', function () {});

  if (details) {
    ga('set', 'dimension1', details.version);
  }

  ga('require', 'displayfeatures');
  ga('send', {
    'hitType': 'pageview',
    'page': '/index.html',
    'sessionControl': 'start',
  });

  if (details) {
    ga('send', 'event', 'Muzli version', 'load', details.version);
  }

})();

(function () {

  window.muzliOpenWindow = function (url, title) {
    var w = 600;
    var h = 450;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var win = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    if (window.focus) {
      win.focus()
    }
  };

  var contactLinks = [
    {href: 'https://muz.li/contact/', text: 'General feedback'},
    {href: 'https://muz.li/contact/', text: 'Suggest a link'},
    {href: 'https://muz.li/subscribe/', text: 'Subscribe to our weekly digest'},
    {href: 'http://muz.li/about/?idea#contact', text: 'Report a bug'}
  ];

  function fetchMuzli(feedFetcher, sort, limit) {
    return feedFetcher.fetch('muzli', sort, limit || 15).then(function (res) {
      return res.data;
    });
  }

  function fetchAll(feedFetcher, sort) {
    return feedFetcher.fetch(null, sort, window.muzli.paging.server).then(function (res) {
      return res.data.map(function (item) {
        item.pick = item.source && item.source.name === 'muzli';
        return item;
      });
    });
  }

  function fetchMuzliClicked(storage) {
    return storage.get("postClicks", true).then(function (obj) {
      return (obj && obj.postClicks) || [];
    });
  }

  function synchMuzliClicked(storage, clickedItems) {
    storage.set({
      postClicks: (clickedItems || []).slice(-500)
    })
  }

  function filterAndReArrangeMuzliPosts(visibleItems, data) {

    var emptyQueue = [];
    var item;
    var i;

    for (i = 0; i < data.length; i++) {

      item = data[i];

      if (!item.source || item.source.name !== 'muzli') {
        continue;
      }

      if (visibleItems.indexOf(item.id) > -1) {
        emptyQueue.push(i);
      }

      else if (emptyQueue.length) {
        var emptyIndex = emptyQueue.splice(0, 1)[0];
        data[emptyIndex] = item;
        emptyQueue.push(i);
      }
    }

    for (i = 0; i < emptyQueue.length; i++) {
      data.splice(emptyQueue[i] - i, 1);
    }

    return data;
  }

  function setAllFeed($timeout, $scope, data) {

    $timeout(function () {

      var visibleItems = $('#sticky li:visible .feedLink').map(function (i, link) {
        return $(link).parents('li').data('muzli-id');
      }).toArray();

      var preloadItems = data.splice(0, visibleItems.length * 3 - 1);

      if (visibleItems && visibleItems.length) {
        filterAndReArrangeMuzliPosts(visibleItems, preloadItems);
        $scope.allFeed = preloadItems;
      } else {
        $scope.allFeed = data;
      }

    }, 100);
  }

  function sortByClicked(data, clickedItems) {
    return data.filter(function (item) {
      return clickedItems.indexOf(item.link) === -1;
    }).concat(data.filter(function (item) {
      return clickedItems.indexOf(item.link) > -1;
    }));
  }

  function loadCompleteControl($scope, feedFetcher, clickedItems, muzliData, storage) {

    $scope.muzliFeed = sortByClicked(muzliData, clickedItems);

    $scope.postClick = function (item, event) {

      var target = $(event.target);

      if (item.video && target.hasClass('postPhoto')) {
        event.preventDefault();
        event.stopPropagation();
        setTimeout(function () {
          target.find('muzli-video > div').click();
        }, 50);
        return;
      }

      if (item.video && (target.hasClass('angular-youtube-wrapper') || target.hasClass('player-image'))) {
        event.preventDefault();
        event.stopPropagation();
        item.playing = true;
        feedFetcher.event.videoClick(item, "sticky");
      }
      else {
        feedFetcher.event.postClick(item, event, "sticky");
      }

      if (item.source && item.source.name === 'muzli') {
        clickedItems.push(item.link);
        synchMuzliClicked(storage, clickedItems);
      }
    };

    $scope.playerVars = feedFetcher.constants.playerVars;
    $scope.openSharer = feedFetcher.event.openSharer;
    $scope.sendSlack = feedFetcher.event.sendSlack;
    $scope.sourceClick = feedFetcher.event.sourceClick;
    $scope.toggleFavorite = feedFetcher.event.toggleFavorite;
    $scope.markNSFW = feedFetcher.event.markNSFW;
    $scope.unmarkNSFW = feedFetcher.event.unmarkNSFW;

    $scope.markHidden = function(item) {
        feedFetcher.event.markHidden(item).then(function(response) {

            var index = $scope.muzliFeed.indexOf(item);

            if (index > -1) {
                $scope.muzliFeed.splice(index, 1);
            }

        });
    }
  }


  allController.$inject = ['$timeout', '$scope', '$q', '$rootScope', 'muzliFeedDefer', 'allFeedDefer', 'feedFetcher', 'storage'];

  function allController($timeout, $scope, $q, $rootScope, muzliFeedDefer, allFeedDefer, feedFetcher, storage) {

    var muzliFeed = muzliFeedDefer.promise;
    var allFeed = allFeedDefer.promise;

    $scope.sponsored = {};

    $rootScope.initScrollTracking($scope);

    feedFetcher.fetchSponsoredPost().then(function (sponsored) {
      $scope.sponsored = sponsored;
    });

    var sec;
    setTimeout(function () {
      sec = true;
    }, 500);

    allFeed.catch(function (err) {
      if (err && err.status === -1 && sec) {
        return;
      }

      $rootScope.setError($scope, 'all-error');
    });

    $q.all([muzliFeed, fetchMuzliClicked(storage)]).then(function (res) {

      var fetchedMuzliItems = res[0];
      var clickedItems = res[1];

      $rootScope.initialLoading = 'loading-muzli-complete';
      loadCompleteControl($scope, feedFetcher, clickedItems, fetchedMuzliItems, storage);

    }).catch(function (err) {

      if (err && err.status === -1 && sec) {
        return;
      }

      $rootScope.setError($scope, 'muzli-error');
    });

    $q.all([allFeed, muzliFeed]).then(function (values) {
      var allFeed = values[0];
      setAllFeed($timeout, $scope, allFeed);
    });

    $q.all([allFeed, muzliFeed, $rootScope.scrolledPromise]).then(function () {
      $rootScope.initialLoading = 'loading-complete';
    });

    $rootScope.$on('sourcesChange', function(){
      fetchAll(feedFetcher, 'created').then(function(allFeed){
        setAllFeed($timeout, $scope, allFeed);
      });
    });
  }

  homeController.$inject = ['$scope', '$timeout', '$rootScope', '$q', 'muzliFeedDefer', 'allFeedDefer', 'feedFetcher', 'storage'];

  function homeController($scope, $timeout, $rootScope, $q, muzliFeedDefer, allFeedDefer, feedFetcher, storage) {

    $rootScope.initScrollTracking($scope);

    window.muzli.pageChange();

    $rootScope.$broadcast('muzliMoveToFullView');

    var muzliFeed = muzliFeedDefer.promise;
    var allFeed = allFeedDefer.promise;

    feedFetcher.fetchSponsoredPost().then(function (sponsored) {
      $scope.sponsored = sponsored;
    });

    $q.all([muzliFeed, allFeed, fetchMuzliClicked(storage)]).then(function (res) {

      var muzliFeed = res[0];
      var allFeed = res[1];
      var clickedItems = res[2];

      loadCompleteControl($scope, feedFetcher, clickedItems, muzliFeed, storage);
      setAllFeed($timeout, $scope, allFeed);

    }).catch(function () {
      $rootScope.setError($scope, 'muzli-error');
    });
  }

  config.$inject = ['$provide', '$stateProvider', '$urlRouterProvider', '$compileProvider', '$animateProvider'];

  function config($provide, $stateProvider, $urlRouterProvider, $compileProvider, $animateProvider) {
    $compileProvider.debugInfoEnabled(false);

    $compileProvider.commentDirectivesEnabled(false);
    $compileProvider.cssClassDirectivesEnabled(false);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

    $animateProvider.classNameFilter(/angular-animate/);

    $provide.decorator("$exceptionHandler", ["$delegate", "trackService", function ($delegate, trackService) {
      return function (exception, cause) {
        var shouldDelegate = trackService.trackError(exception);

        // (Optional) Pass the error through to the delegate formats it for the console
        if (shouldDelegate) {
          $delegate(exception, cause);
        }
      };
    }]);

    $urlRouterProvider.otherwise(function ($injector) {
      var $state = $injector.get('$state');

      if (window.REGISTERED === 'favorite') {
        $state.go('favorites');
        return;
      }

      var storage = $injector.get('storage');
      return storage.get('homeSwitched').catch(function () {
        return {
          homeSwitched: false
        }
      }).then(function (res) {
        $state.go(res.homeSwitched ? 'all-muzli' : 'all', {}, {reload: true});
      });
    });

    /*==============================
    =            Routes            =
    ==============================*/

    $stateProvider.state('all', {
      templateUrl: 'modules/muzli/home.html',
      controller: allController,
      params: {
        sort: 'created'
      },
      resolve: {
        muzliFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }],
        allFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchAll(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }]
      }
    });

    $stateProvider.state('all-muzli', {
      templateUrl: 'modules/muzli/home.html',
      controller: allController,
      params: {
        sort: 'created'
      },
      resolve: {
        muzliFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }],
        allFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort, 500).then(defer.resolve, defer.reject);
          return defer;
        }]
      }
    });

    $stateProvider.state('home', {
      templateUrl: 'modules/muzli/home.html',
      controller: homeController,
      params: {
        sort: 'created'
      },
      resolve: {
        reLoadSources: ['$rootScope', function($rootScope){
          localStorage.setItem('lastUserUpdate', new Date());
          return $rootScope.$broadcast('reLoadSources');
        }],
        muzliFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }],
        allFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchAll(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }]
      }
    });

    $stateProvider.state('home-muzli', {
      templateUrl: 'modules/muzli/home.html',
      controller: homeController,
      params: {
        sort: 'created'
      },
      resolve: {
        reLoadSources: ['$rootScope', function($rootScope){
          localStorage.setItem('lastUserUpdate', new Date());
          return $rootScope.$broadcast('reLoadSources');
        }],
        muzliFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort).then(defer.resolve, defer.reject);
          return defer;
        }],
        allFeedDefer: ['$q', 'feedFetcher', '$stateParams', function ($q, feedFetcher, $stateParams) {
          var defer = $q.defer();
          var sort = $stateParams.sort;
          fetchMuzli(feedFetcher, sort, 500).then(defer.resolve, defer.reject);
          return defer;
        }]
      }
    });
  }

  run.$inject = ['$timeout', '$rootScope', '$q', '$state', '$interval', 'feedFetcher', 'userService', 'socialService', 'trackService', 'storage', 'sources_list', 'sites', 'experiments'];


  /*===========================
  =            RUN            =
  ===========================*/

  function run($timeout, $rootScope, $q, $state, $interval, feedFetcher, userService, socialService, trackService, storage, sources_list, sites, experiments) {

    var scrollDefer = $q.defer();
    var revealDistance = 0;
    var resetRevealTimeout;
    var pauseScrollTimeout;
    var nextState;

    //Base for A/B testing using GA custom dimensions
    experiments.getExperiment('50/50').then(function(testExperiment) {
      if (testExperiment.variant === 1) {
          trackService.setDimension('dimension2', 'First-half');
      } else {
          trackService.setDimension('dimension2', 'Second-half');
      }
    });

    trackService.onLoad(storage, sources_list, sites);

    $rootScope.$state = $state;

    window.muzli.closeOnEsc.push(function () {
      $rootScope.menuOpen = false;
    });

    function moveToFullView () {
      $rootScope.isSwitchedToHalfView = true;
      $rootScope.feedVisibleClass = 'halfView';
      $('main').off("wheel scroll")
      activateAd();
    }

    function activateAd(){
      feedFetcher.fetchSponsoredPost().then(function(ad){
        ad.active = true;
      });
    }

    function setView() {

      storage.get(['lite', 'halfView']).then(function (res) {

        var isSwitchedToHalfView;

        if (window.muzli.isSafari) {
          isSwitchedToHalfView = true;
        }

        else {
          isSwitchedToHalfView = angular.isDefined(res.halfView) ? !!res.halfView : !!res.lite;

          if (window.muzli.getRuntime().id !== "non_chrome") {
            $rootScope.isLiteVersion = res.lite;
          }
        }

        $rootScope.isSwitchedToHalfViewIndicator = isSwitchedToHalfView;
        $rootScope.isSwitchedToHalfView = isSwitchedToHalfView;

        if (!$rootScope.feedVisibleClass) {
          $rootScope.feedVisibleClass = isSwitchedToHalfView ? 'halfView' : '';
        }

        if (isSwitchedToHalfView) {
          activateAd();
        } else {
          scrollDefer.promise.then(activateAd);
        }

      });
    }

    setView();

    $rootScope.$on('muzliSetView', setView);
    $rootScope.$on('muzliMoveToFullView', moveToFullView);

    $rootScope.$on('$stateChangeStart', function (event, state) {
      nextState = state.name;
      $rootScope.errors = [];

      window.muzli.removeTooltips('#feed [title]');
    });

    $rootScope.$on('$stateChangeSuccess', function (event, state, toParams) {

      $rootScope.currentFeedSort = toParams.sort || 'created';

      console.log('State changed to: ' + state.name);
    });

    storage.get(['installDate', 'updateDate']).then(function (res) {

      var installDate = res.installDate || '01012017';
      var updateDate = res.updateDate || '01012017';
      var scrollProgressBar = $('.progress');


      $rootScope.installDate = installDate;
      $rootScope.updateDate = updateDate;
      $rootScope.bootstrapped = true;

      $(window).on('beforeunload', function () {
        window.muzli.pageChange();
      });

      //If home screen is not full feed - hook scroll events to reveal it
      if (!$rootScope.isSwitchedToHalfView) {

        $('main').on("wheel scroll", function (e) {

          function resetReveal(ratio) {
            $({ val: ratio }).animate({ val: 180 }, { step: function (now) {
              scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + now + 'deg)');
             } })
          };

          //Prevent scrolling if connection error occured
          if ($rootScope.errors.length) {
            return;
          }

          revealDistance -= e.originalEvent.wheelDeltaY;

          var absRevealDistance = Math.abs(revealDistance);

          if (absRevealDistance < 250) {

            //Set progress range between 180 and 295deg
            var revealRatio = Math.round(115 / 1000 * absRevealDistance) + 180;

            scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + revealRatio + 'deg)');

            clearTimeout(resetRevealTimeout);
            resetRevealTimeout = setTimeout(function() {

              absRevealDistance = 0

              resetReveal(revealRatio);
            }, 750);

            e.preventDefault();

          } else {

            clearTimeout(resetRevealTimeout);

            if (pauseScrollTimeout) {

              e.preventDefault();
              return;

            } else {

              if (pauseScrollTimeout === 0) {
                $('main').off("wheel scroll");
                return;
              }

              pauseScrollTimeout = setTimeout(function() {
                pauseScrollTimeout = 0;
              }, 1000)

              e.preventDefault();
            }

            $({ val: 210 }).animate({ val: 295 }, {
              duration: 200,
              step: function (now) {
                scrollProgressBar.css('transform', 'translateX(-50%) rotate(' + now + 'deg)');
              },
              complete: function() {
                setTimeout(function() {
                  $rootScope.feedVisibleClass = "halfView";
                  $rootScope.initialLoading = 'loading-scrolled';
                  scrollDefer.resolve('User scrolled');
                }, 100);
              }
            })

          }
        });
      }

      $rootScope.uninstallClick = function () {
        trackService.track({
          category: 'Settings menu',
          action: 'Click',
          label: 'Remove Muzli from Chrome'
        });

        window.chrome.management.uninstallSelf({showConfirmDialog: true});

      };
    });

    $state.goHome = function () {
      $state.go($rootScope.homeSwitched ? 'home-muzli' : 'home', {}, {reload: true});
    };

    $rootScope.reloadPage = function () {
      window.location.reload();
    };

    $rootScope.updateExtension = function(event) {

      $rootScope.blocker.loading = true;

      chrome.runtime.onUpdateAvailable.addListener(function(details) {
        window.chrome.storage.local.set({openAfterInit: true}, function() {
          chrome.runtime.reload();
          window.close();
        })
      });

      chrome.runtime.requestUpdateCheck(function(status) {

        console.log('Extension update status:', status);

        if (status === 'throttled') {
          chrome.runtime.reload();
          delete $rootScope.blocker;
        }

        if (status === 'no_update') {
          delete $rootScope.blocker;
        }

      })
    }

    $rootScope.shakeBlocker = function(event) {

      var shakeElement = $('.blocker .wrapper');

      console.log(shakeElement)

      $(shakeElement).addClass('shake');

      setTimeout(function() {
        $(shakeElement).removeClass('shake');
      }, 750);
    }

    $rootScope.events = {
      sidebar: {
        show: function () {
          trackService.track({
            category: 'Sidebar',
            action: 'Show',
            label: 'sidebar'
          });
        },
        clickLink: function (name, event) {
          event.stopPropagation();

          trackService.track({
            category: 'Sidebar',
            action: 'Click',
            label: 'Site Link: ' + name
          });
        }
      },
      settingsMenu: {
        clickLink: function (text) {
          trackService.track({
            category: 'Settings menu',
            action: 'Click',
            label: text
          });
        }
      },
      quickAccess: {
        click: function (url) {
          trackService.track({
            category: 'Quick access',
            action: 'Click',
            label: url
          });
        }
      }
    };

    $rootScope.contactLinks = contactLinks;

    $rootScope.scrolledPromise = scrollDefer.promise;

    $rootScope.initialLoading = 'loading-start';

    $rootScope.setTheme = function (name) {
      $rootScope.theme = name;
      userService.setData({
        theme: name
      });
    };

    $rootScope.closeAlert = function (alert) {
      userService.markReadAlert({
        id: alert.id
      }).then(function(response) {

        $rootScope.user.unread_alerts = response;

        var index = $rootScope.alerts.indexOf(alert);
        $rootScope.alerts.splice(index, 1);

        trackService.track({
          category: 'Bar notifications',
          action: 'Dismiss click',
          label: $('<span>' + alert.content + '</span>').text(),
        });

      });
    };

    $rootScope.logAlertCta = function(alert, $event) {

      if (!$($event.target).is('a')) {
        return;
      }

      trackService.track({
        category: 'Bar notifications',
        action: 'CTA click',
        label: $($event.target).text() + ' | ' + $('<span>' + alert.content + '</span>').text(),
      });
    };

    $rootScope.getFeedClass = function () {
      var name = 'feed-';
      var currentSource = $rootScope.currentSource;
      if (currentSource && currentSource.name) {
        name += currentSource.name;
      }
      else {
        name += currentSource
      }

      if ($rootScope.feedVisibleClass) {
        name += (' ' + $rootScope.feedVisibleClass);
      }

      if ($rootScope.initialLoading) {
        name += (' ' + $rootScope.initialLoading);
      }

      return name;
    };

    $rootScope.clickLogo = function () {
      trackService.track({
        category: 'Sidebar',
        action: 'Click',
        label: 'muzli logo'
      });

      $state.goHome();
    };

    $rootScope.onSearch = function (event, value) {
      if (event.which == 13) {
        document.location = "http://muz.li/search/?q=" + value;
      }
    };

    $rootScope.openMenu = function () {

      $rootScope.menuOpen = true;

      trackService.track({
        category: 'Settings menu',
        action: 'Click',
        label: 'Open'
      });

      //???
      $(document).on("click.menuOpen", function (e) {
        if ($(e.target).parents('.feedLink').length) {
          e.preventDefault();
        }
      });
    };

    $rootScope.closeMenu = function () {
      $rootScope.menuOpen = false;
      $rootScope.uninstall = false;
      $("aside").removeClass("uninstall");
      $(document).off("click.menuOpen");
    };

    $rootScope.bodyKeyUp = function (event) {
      if (event.keyCode === 27) {
        $("aside").removeClass("uninstall");

        window.muzli.closeOnEsc.forEach(function (item) {
          item();
        });
      }
    };

    $rootScope.bodyKeyDown = function (event) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      var c = String.fromCharCode(event.keyCode);
      var isWordCharacter = c.match(/\w/);
      var isBackspaceOrDelete = (event.keyCode == 8 || event.keyCode == 46);
      var noFocus = $("input[type=text],input[type=url]").is(':focus');


      if ($rootScope.searchSources) {
        $rootScope.openSidebar = true;
      }

      if (((isWordCharacter || isBackspaceOrDelete) && !noFocus)) {

        $rootScope.openSidebar = true;
        $("input[ng-model=searchSources]").focus();
        if (!$rootScope.isSwitchedToHalfView && $rootScope.jumpToRecent) {
          $rootScope.jumpToRecent()
        }
      }

      if (event.keyCode == 27 || event.keyCode == 13) {
          $("input[ng-model=searchSources]").blur();
        $rootScope.openSidebar = false;
        $rootScope.searchSources = '';
      }
    };

    $rootScope.clickOutsideSidebar = function () {
      $("input[ng-model=searchSources]").blur();
      $rootScope.openSidebar = false;
    };

    $rootScope.twitterFollow = function () {
      window.open('https://twitter.com/intent/follow?screen_name=usemuzli', 'follow', 'height=400,width=550');
    };

    $rootScope.reload = function () {
      if (!$rootScope.user) {
        window.location.reload();
        return;
      }
      $state.reload();
    };

    $rootScope.sortFeed = function (sort) {
      var current = $state.current.name;
      var params = { sort: sort };
      if (sort === 'virality') {
        if (current === 'all' || current == 'home') {
          current = 'sources';
        }
        else if (current === 'all-muzli' || current === 'home-muzli') {
          current = 'feed';
          params.name = 'muzli';
        }
      }

      $state.go(current, params, {reload: true});
      var sortValue = (sort === 'virality') ? 'Popular' : 'Recent';
      trackService.track({
        category: 'Feed',
        action: 'Sort',
        label: sortValue
      });
    };

    $rootScope.setError = function ($scope, error) {
      $timeout(function () {
        if (!$scope.$$destroyed && !$rootScope.userNavigatingAway) {
          $rootScope.errors.push(error);
        }
      }, 100);
    };

    $rootScope.initScrollTracking = function($scope) {

      var scrollDistance = 0;
      var currentState = $scope.$state.current.name;
      var currentSource = $scope.$state.params.name;

      function trackScrollDistance(e) {
        scrollDistance -= e.originalEvent.wheelDeltaY;
      }

      $('body').on("wheel scroll", trackScrollDistance);

      $scope.$on("$destroy", function() {

        chrome.runtime.sendMessage({
          scrollDistance: scrollDistance,
          state: currentState,
          source: currentSource,
        });

        $('body').off("wheel scroll", trackScrollDistance);

      });

      window.addEventListener("beforeunload", function(e){
        chrome.runtime.sendMessage({
          scrollDistance: scrollDistance,
          state: currentState,
          source: currentSource,
        });
      }, false);
    }

    if (window.chrome) {

      $rootScope.jumpToRecent = function () {

        moveToFullView();

        $rootScope.feedVisibleClass = "halfView";
        $rootScope.initialLoading = 'loading-scrolled';
        scrollDefer.resolve('User clicked scroll trigger');
      };

      $rootScope.toggleMinimalView = function () {
        $rootScope.isSwitchedToHalfViewIndicator = !$rootScope.isSwitchedToHalfViewIndicator

        var setData = userService.setData({
          halfView: $rootScope.isSwitchedToHalfViewIndicator
        }, !$rootScope.isSwitchedToHalfViewIndicator);

        if ($rootScope.isSwitchedToHalfViewIndicator) {
          moveToFullView();
        } else {
          setData.then(function() {
            location.reload();
          });
        }
      };
    }

    if (window.chrome && window.chrome.tabs) {

      $rootScope.goToChromeApps = function () {
        window.chrome.tabs.getCurrent(function (tab) {
          window.chrome.tabs.update(tab.id, {
            "url": "chrome://apps/"
          });
        });
      };

      $rootScope.uninstallIntent = function () {
        $("aside").addClass("uninstall");
        $rootScope.uninstall = true;
        trackService.track({
          category: 'Settings menu',
          action: 'Click',
          label: 'Uninstall intent'
        });
      };

      $rootScope.uninstallIntentCancel = function () {
        $("aside").removeClass("uninstall");
        $rootScope.uninstall = false;
      };

      $rootScope.switchToLite = function () {
        trackService.track({
          category: 'Settings menu',
          action: 'Click',
          label: 'Switch to lite version'
        });

        $q.all([userService.setData({halfView: true}), storage.set({lite: true})]).then(function () {
          setTimeout(function () {
            chrome.tabs.getCurrent(function (tab) {
              chrome.tabs.update(tab.id, {
                "url": "chrome-search://local-ntp/local-ntp.html"
              });
            });
          }, 500);
        });
      };

      $rootScope.toggleIsLiteVersion = function () {
        $rootScope.isLiteVersion = !$rootScope.isLiteVersion;
        storage.set({lite: $rootScope.isLiteVersion});
      };
    }

    //Launch timer
    var tick = function() {
      $rootScope.currentTime = Date.now();
    }

    tick();
    $interval(tick, 1000);

    socialService.fetch().then(function (res) {
      $rootScope.muzliSocial = res;
    });

    //Track when user switches to full view
    scrollDefer.promise.then(function(label) {
      trackService.track({
        category: 'Home',
        action: 'Scroll',
        label: label,
      });
    })

    //Set flag if user is nav igating away from tab
    window.addEventListener("beforeunload", function(e){
      $rootScope.userNavigatingAway = true;
    }, false);
  }

  try {
    var moduleTemplate = angular.module('muzli-template')
  }
  catch (e) {
    moduleTemplate = angular.module('muzli-template', [])
  }

  angular.module('muzli', [moduleTemplate.name,
    'ngAnimate',
    'ui.router',
    'angular-click-outside',
    'bootstrap',
    'user',
    'search',
    'sources',
    'feed',
    'sites'])
  .constant('R', window.R)
  .constant('server', window.MUZLI_SERVER)
  .config(config)
  .run(run);

})();
