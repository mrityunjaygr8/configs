(function () {

  service.$inject = ['$q', '$http', 'server', 'sources_list', 'storage', 'userService'];
  function service ($q, $http, server, sources, storage, userService) {

    var latestFeedFetch = fetchLatestFromServer();

    var muzli = {
      name: 'muzli',
      title: 'Our Picks',
      channel: 'design',
      url: 'muz.li',
      weight: 2
    };

    function fetchLatestFromServer () {
      return $http({
        method: 'GET',
        url: server + '/latest'
      }).then(function (res) {
        return res.data.latest;
      });
    }

    function fetchSources () {
      return userService.getData().then(function (res) {
        // if (res.sources && !(res.sources instanceof Array) && window.trackJs) {
        //   window.trackJs.track({text: "fetchLocalStorage error", value: res.sources});
        //   return [];
        // }
        return res.sources || [];
      }).catch(function (err) {
        if (err && err.status === 401) {
          return [];
        }
        return $q.reject(err);
      });
    }

    function fetchMuzli () {
      return storage.get('muzli').then(function (res) {
        return res.muzli;
      });
    }

    function findByName (sources, name) {
      // if (sources && !(sources instanceof Array) && window.trackJs) {
      //   window.trackJs.track({text: "findByName error", value: sources});
      //   return {};
      // }
      return sources.filter(function (item) {
        return item.name === name;
      })[0];
    }

    // since server may not always return the most recent posts newest latest needs
    // to be saved locally and compared to result
    function chooseLatest (local, remote) {
      if (local && !remote) {
        return local;
      }

      if (!local && remote) {
        return remote;
      }

      return new Date(local) < new Date(remote) ? remote : local;
    }

    function isRead (lastRead, latest) {
      if (!latest) {
        return true
      }
      if (latest && !lastRead) {
        return false;
      }

      return !(new Date(lastRead) < new Date(latest));
    }

    function fetchMuzliLatest () {
      return $q.all([fetchMuzli(), latestFeedFetch]).then(function (res) {
        var localMuzli = res[0] || { lastRead: new Date().getTime() };
        var latest = res[1][muzli.name];

        var _latestMuzli = chooseLatest(localMuzli.latest, latest);

        return {
          latest: _latestMuzli.latest,
          lastRead: localMuzli.lastRead,
          read: isRead(localMuzli.lastRead, latest)
        };
      });
    }

    function fetchLatest () {
      return $q.all([fetchSources(), latestFeedFetch]).then(function (res) {
        var localSources = res[0];
        var latest = res[1];

        return localSources.map(function (source) {
          var savedSource = findByName(localSources, source.name) || {
              enabled: source.enabled !== false,
              lastRead: new Date().getTime()
            };

          var _latest = chooseLatest(savedSource.latest, latest[source.name]);

          return {
            name: source.name,
            latest: _latest,
            enabled: savedSource.enabled,
            lastRead: savedSource.lastRead,
            read: isRead(savedSource.lastRead, _latest)
          }
        });
      });
    }

    return {
      findByName: findByName.bind(this, sources.concat([muzli])),
      fetchMuzli: function () {
        return fetchMuzliLatest().then(function (localMuzli) {
          return {
            name: muzli.name,
            title: muzli.title,
            read: localMuzli && localMuzli.read,
            latest: localMuzli && localMuzli.latest,
            lastRead: localMuzli && localMuzli.lastRead
          };
        }).catch(function () {
          return {
            name: muzli.name,
            title: muzli.title
          };
        });
      },
      fetch: function (skipCache) {
        if (skipCache) {
          latestFeedFetch = fetchLatestFromServer();
        }

        return fetchLatest().then(function (localSources) {
          var mappedSources = sources.map(function (source, index) {
            var savedSource = findByName(localSources, source.name) || {
                enabled: source.enabled !== false
              };

            var position = localSources.indexOf(savedSource);

            return {
              name: source.name,
              tags: source.tags,
              icon: source.icon,
              nsfw: source.nsfw,
              base64: source.base64,
              title: source.title,
              url: source.url ? encodeURIComponent("http://" + source.url) : source.url,
              description: source.description,
              position: position > -1 ? position : index,
              enabled: savedSource.enabled,
              read: savedSource.read,
              latest: savedSource.latest,
              lastRead: savedSource.lastRead
            }
          });

          mappedSources.sort(function (source, _source) {
            return source.position - _source.position;
          });

          mappedSources.forEach(function (source) {
            delete source.position;
          });

          return mappedSources;
        });
      },
      getWeightedSources: function () {
        return fetchLatest().then(function (localSources) {
          var mappedSources = sources.map(function (source) {
            var savedSource = findByName(localSources, source.name) || { enabled: source.enabled !== false };

            return {
              name: source.name,
              weight: source.weight,
              enabled: savedSource.enabled
            }
          });

          return mappedSources.filter(function (source) {
            return source.enabled;
          }).concat([muzli]).map(function (source) {
            return {
              weight: source.weight || 1,
              name: source.name
            }
          });
        });
      },
      sync: function (sources, syncAsTemp) {
        sources = sources.map(function (source) {
          var res = {
            name: source.name,
            enabled: source.enabled
          };

          if (source.latest) {
            res.latest = source.latest;
          }

          if (source.read && source.latest) {
            res.lastRead = source.latest;
          }
          else if (source.lastRead) {
            res.lastRead = source.lastRead;
          }
          else {
            res.lastRead = new Date().getTime();
          }

          return res;
        });

        return userService.setData(syncAsTemp ? {
          _sources: sources
        } : {
          sources: sources
        });
      },
      syncMuzli: function (muzli) {
        var res = {
          name: muzli.name
        };

        if (muzli.latest) {
          res.latest = muzli.latest;
        }

        if (muzli.read && muzli.latest) {
          res.lastRead = muzli.latest;
        }
        else if (muzli.lastRead) {
          res.lastRead = muzli.lastRead;
        }
        else {
          res.lastRead = new Date().getTime();
        }

        storage.set({
          muzli: res
        });
      }
    }
  }

  angular.module('sources')
    .factory('sources', service);

})();
