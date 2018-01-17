(function () {
  var fuseSearchDistance = 1;
  var fuseSearchThreshold = 0.2;

  localStorage.setItem('lastUserUpdate', new Date());

  function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function sortSources (sources) {
    var disabled = sources.reduce(function (arr, source, index) {
      if (!source.enabled) {
        arr.push({
          index: index,
          source: source
        });
      }
      return arr;
    }, []);

    disabled.forEach(function (item, index) {
      sources.splice(item.index - index, 1);
      sources.push(item.source);
    });
  }

  run.$inject = ['$q', '$rootScope', '$state', 'sources', 'trackService', 'userService', 'bundles_list', '$timeout'];
  function run ($q, $rootScope, $state, sources, trackService, userService, bundles_list, $timeout) {

    $rootScope.vm = $rootScope.vm || {};
    $rootScope.searchSources = '';

    function resetEnabledState () {
      $rootScope.sources.forEach(function (source) {
        source._enabled = source.enabled;
      });
    }

    function commitEnabledState () {
      $rootScope.sources.forEach(function (source) {
        source.enabled = source._enabled;
      });
    }

    function loadMuzli () {
      sources.fetchMuzli().then(function (data) {
        $rootScope.muzli = data;
      });
    }

    function loadSourcesData (skipCache) {

      userService.getData().then(function (user) {
        $rootScope.hive.neverOpened = !user.opened_sources;
      });

      sources.fetch(skipCache).then(function (_sources) {
        $rootScope.sources = _sources;
        resetEnabledState();
        sortSources($rootScope.sources);
      });
    }

    function reLoadSources () {
      userService.reLoadUser()
      loadSourcesData(true);
      loadMuzli();
    }

    loadSourcesData();
    loadMuzli();

    window.addEventListener('storage', function (e) {
      if (e.key === 'lastUserUpdate') {
        reLoadSources();
      }
    });

    $rootScope.$on('reLoadSources', reLoadSources);

    $rootScope.sideBarSortableOptions = {
      containment: '.sources',
      distance: 30,
      //scrollSpeed: 10,
      //scrollSensitivity: 10,
      //dropOnEmpty: false,
      tolerance: "pointer",
      start: function () {
        $rootScope.$apply(function () {
          $rootScope.sourcesDragged = true;
        });
      },
      stop: function (e, obj) {
        $rootScope.sourcesDragged = false;

        sources.sync($rootScope.sources);

        var source = obj.item.data('source');
        var item = $rootScope.sources.filter(function (_source) {
          return _source.name === source;
        })[0];
        var position = $rootScope.sources.indexOf(item);
        trackService.track({
          category: 'Sidebar',
          action: 'Reorder',
          label: source,
          value: position
        });
      }
    };

    $rootScope.homeSwitch = function (active) {

      if ($rootScope.homeSwitched !== active) {

        $rootScope.homeSwitched = active;
        userService.setData({ homeSwitched: active });

        return $state.goHome();
      }
    };

    $rootScope.clickSource = function (source) {
      if (source) {
        $state.go('feed', { name: source.name, sort: 'created' }, { reload: true });
      }
      else {
        $state.go('sources', {}, { reload: true });
      }

      trackService.track({
        category: 'Sidebar',
        action: 'Click',
        label: 'Source: ' + (source ? source.name : 'all')
      });

      if (source && source.name !== 'muzli' && event && event.target.scrollIntoView) {
        setTimeout(function () {
          var li = $('.sources li[data-source="' + source.name + '"]')[0];
          if (!isElementInViewport(li)) {
            li.scrollIntoView();
          }
        }, 300);
      }
    };

    $rootScope.mouseEnterSidebar = function () {

      $rootScope.sidebarTrackTimeout = setTimeout(function() {
        $rootScope.events.sidebar.show();
      }, 1000);

      $('.sourceSearch input').focus();
    };

    $rootScope.mouseLeaveSidebar = function () {
      clearTimeout($rootScope.sidebarTrackTimeout);
    };

    $rootScope.hive = {
      search: '',
      showSourceInventory: false,
      neverOpened: false,
      tagFilters: {
        design: false,
        tech: false,
        news: false,
        other: false
      },
      show: function ($event, force) {
        $event.stopPropagation();
        resetEnabledState();

        if ($rootScope.hive.neverOpened) {
          $rootScope.hive.neverOpened = false;
          userService.setData({
            opened_sources: true
          });
        }

        (force ? $q.when() : userService.getData().then(function (user) {
          if (user.anonymous && user.hasUserLogin) {
            $rootScope.vm.showSignInDialogReLogin = true;
            return $q.reject('anonymous');
          }
        })).then(function () {

          document.body.style.overflow = 'hidden';

          $rootScope.hive.showSourceInventory = true;
          $rootScope.hive.search = '';
          
          for (var filter in $rootScope.hive.tagFilters) {
            if ($rootScope.hive.tagFilters.hasOwnProperty(filter)) {
              $rootScope.hive.tagFilters[filter] = false;
            }
          }

          $rootScope.vm.showWelcome = false;
          $rootScope.vm.showSignInDialogReLogin = false;
          $rootScope.vm.showSignInDialog = false;

          setTimeout(function () {
            $('.sourceInventory .search input').focus();
          }, 300);
        });

        trackService.track({
          category: 'Sidebar',
          action: 'Feed inventory',
          label: 'Open'
        });
      },
      cancel: function () {
        document.body.style.overflow = '';

        $rootScope.hive.showSourceInventory = false;
        resetEnabledState();
      },
      complete: function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        userService.getData().then(function (user) {
          if (!user.anonymous) {
            $rootScope.hive.showSourceInventory = false;
            document.body.style.overflow = '';

            commitEnabledState();
            sortSources($rootScope.sources);

            sources.sync($rootScope.sources).then(function () {
              if ($rootScope.currentSource === 'all') {
                $state.goHome();
              }
              else if (['home', 'sources'].indexOf($rootScope.currentSource) > -1) {
                $state.reload();
              }
            });
          }
          else {
            sources.sync($rootScope.sources.map(function (item) {
              return {
                name: item.name,
                enabled: item._enabled,
                lastRead: item.lastRead
              };
            }), true).then(function () {
              $rootScope.vm.showSignInDialog = 'sources';
            });
          }
        });
      },
      toggle: function (source) {
        source._enabled = !source._enabled;
      },
      toggleFilter: function (filter) {
        for (var key in $rootScope.hive.tagFilters) {
          if ($rootScope.hive.tagFilters.hasOwnProperty(key)) {
            $rootScope.hive.tagFilters[key] = filter === key;
          }
        }
        $rootScope.hive.search = '';
      }
    };

    $rootScope.$watch('hive.search', function (value) {
      if (!value) {
        return;
      }
      for (var key in $rootScope.hive.tagFilters) {
        if ($rootScope.hive.tagFilters.hasOwnProperty(key)) {
          $rootScope.hive.tagFilters[key] = false;
        }
      }
    });

    $rootScope.$watch('searchSources', function (value) {
      $rootScope.sideBarSortableOptions.disabled = !!value;
      if (value) {
        $rootScope.preFocusedSourceIndex = 0
      }
      else {
        $rootScope.preFocusedSourceIndex = -1;
      }
    });

    $rootScope.searchSourcesKeyDown = function (event, filteredSources) {
      if (!$rootScope.searchSources) {
        return;
      }

      if (event.which === 13) {
        $rootScope.searchSources = '';
        $rootScope.clickSource(filteredSources[$rootScope.preFocusedSourceIndex])
      }

      if (event.which === 40) {
        if ($rootScope.preFocusedSourceIndex < filteredSources.length - 1) {
          $rootScope.preFocusedSourceIndex++;
        }
      }

      if (event.which === 38) {
        if ($rootScope.preFocusedSourceIndex > 0) {
          $rootScope.preFocusedSourceIndex--;
        }
      }
    };

    $rootScope.blurSearchSources = function () {
      $timeout(function () {
        $rootScope.searchSources = '';
      }, 300);

    };

    $rootScope.clickBundle = function (name) {

      window.muzli.removeTooltips('.bundles [title]');

      $rootScope.sources.forEach(function (source) {
        source._enabled = bundles_list[name].indexOf(source.name) > -1;
      });

      commitEnabledState();
      
      sortSources($rootScope.sources);
      sources.sync($rootScope.sources);

      $rootScope.vm.showWelcome = false;

      trackService.track({
        category: 'Bundles',
        action: 'Select',
        label: name
      });

      userService.setData({ selectedBundle: name }).then(function () {
        $rootScope.$broadcast('sourcesChange');
      });
    };

    $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
      $rootScope.currentSource = toState.directSource ? sources.findByName(toStateParams.name) : toState.name;
    });

    window.muzli.closeOnEsc.push(function () {
      if ($rootScope.hive.showSourceInventory) {
        resetEnabledState();
        $rootScope.hive.showSourceInventory = false;
        document.body.style.overflow = '';
      }
    });
  }

  function sourcesFilter () {
    return function (array, value) {
      if (!array) {
        return [];
      }

      array = array.filter(function (source) {
        return source.enabled;
      });

      if (!value) {
        return array;
      }

      return new Fuse(array, {
        distance: fuseSearchDistance,
        threshold: fuseSearchThreshold,
        tokenize: true,
        keys: ['title']
      }).search(value);
    };
  }

  sourcesHiveFilter.$inject = ['other_tags_list', 'R'];
  function sourcesHiveFilter (other_tags_list, R) {
    function reduceFilter (array, value) {
      return R.uniq(new Fuse(array, {
        distance: fuseSearchDistance,
        threshold: fuseSearchThreshold,
        tokenize: true,
        keys: ['title', 'url']
      }).search(value)
        .concat(new Fuse(array, {
          distance: fuseSearchDistance,
          threshold: fuseSearchThreshold,
          tokenize: true,
          keys: ['tags']
        }).search(value)));
    }

    return function (array, value, tagFilters, showSourceInventory) {
      if (!showSourceInventory || !array) {
        return [];
      }

      var hasTagFilters = !!Object.keys(tagFilters).filter(function (key) {
        return tagFilters[key];
      }).length;

      var filteredSources = !hasTagFilters ? array : array.filter(function (source) {
        for (var key in tagFilters) {
          if (tagFilters.hasOwnProperty(key) && tagFilters[key]) {
            if (key === 'other' && R.intersection([source.tags[0]], other_tags_list).length) {
              return true;
            }
            else if (key !== 'other' && [source.tags[0]].indexOf(key) > -1) {
              return true;
            }
          }
        }
        return false;
      });

      if (value) {
        return reduceFilter(filteredSources, value);
      }

      return filteredSources;
    };
  }

  relatedSourcesHiveFilter.$inject = ['R'];
  function relatedSourcesHiveFilter (R) {
    return function (sources, filteredSources) {
      if (!sources || !filteredSources || !sources.length || !filteredSources.length) {
        return [];
      }

      var otherTags = R.uniq(filteredSources.reduce(function (acc, source) {
        return acc.concat(source.tags);
      }, []));

      return R.without(filteredSources, sources).map(function (source) {
        return {
          count: R.intersection(source.tags, otherTags).length / source.tags.length,
          source: source
        };
      }).filter(function (sourceWithCount) {
        return sourceWithCount.count > 0;
      }).sort(function (item, _item) {
        var count = item.count;
        var source = item.source;
        var _source = _item.source;
        var _count = _item.count;

        if (_count === count) {
          if (otherTags[1] === source.tags[0]) {
            return -1;
          }
          if (otherTags[1] === _source.tags[0]) {
            return 1;
          }
        }
        else if (count > _count) {
          return 1;
        }
        else if (count < _count) {
          return -1;
        }
        return 0
      }).reverse().map(function (item) {
        return item.source;
      });
    };
  }

  angular.module('sources', ['ui.sortable', 'ui.router'])
    .run(run)
    .filter('sourcesHiveFilter', sourcesHiveFilter)
    .filter('relatedSourcesHiveFilter', relatedSourcesHiveFilter)
    .filter('sourcesFilter', sourcesFilter)
})();
